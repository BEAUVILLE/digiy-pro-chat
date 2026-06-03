/* ============================================================
   DIGIYLYFE · ABOS ACCESS BRIDGE
   Fichier commun pour les modules PRO.

   Rôle :
   - Vérifier si un téléphone a accès à un module via le rail central :
     public.digiy_has_module_access_from_abos(phone, module)
   - Ne remplace pas guard.js.
   - Se branche DANS les guards existants, sans casser le PIN local.
   - Ne remet pas le téléphone dans l’URL visible.
   ============================================================ */

(function () {
  "use strict";

  const DEFAULT_SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
  const DEFAULT_SUPABASE_KEY = "sb_publishable_tGHItRgeWDmGjnd0CK1DVQ_BIep4Ug3";

  const STORAGE_PREFIX = "DIGIY_ABOS_ACCESS";
  const DEFAULT_TTL_MS = 10 * 60 * 1000;

  const MODULE_ALIASES = {
    EXPLORE: "EXPLORE_BOOST",
    RESEAU: "RESEAU_DIGIY",
    "RÉSEAU": "RESEAU_DIGIY",
    RESEAU_DIGIY: "RESEAU_DIGIY",
    DRIVER: "DRIVER",
    LOC: "LOC",
    RESA: "RESA",
    MARKET: "MARKET",
    POS: "POS",
    BUILD: "BUILD",
    JOBS: "JOBS",
    RESTO: "RESTO",
    PAY: "PAY"
  };

  function now() {
    return Date.now();
  }

  function cleanPhone(value) {
    const raw = String(value || "").replace(/\D/g, "");
    if (raw.length === 9) return "221" + raw;
    return raw;
  }

  function upperModule(value) {
    const raw = String(value || "")
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/-/g, "_");

    return MODULE_ALIASES[raw] || raw;
  }

  function readQuery(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (_) {
      return null;
    }
  }

  function cleanVisibleUrl() {
    try {
      const url = new URL(window.location.href);

      [
        "phone",
        "tel",
        "p",
        "owner_phone",
        "slug_phone",
        "session_token",
        "token",
        "pin",
        "code"
      ].forEach(function (key) {
        url.searchParams.delete(key);
      });

      history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    } catch (_) {}
  }

  function readStorage(keys) {
    for (const key of keys) {
      try {
        const v = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (v) return v;
      } catch (_) {}
    }
    return "";
  }

  function readSessionPhoneFromJson(keys) {
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (!raw) continue;

        const obj = JSON.parse(raw);
        const phone = cleanPhone(
          obj.phone ||
          obj.tel ||
          obj.owner_phone ||
          obj.user_phone ||
          ""
        );

        if (phone) return phone;
      } catch (_) {}
    }

    return "";
  }

  function guessPhone() {
    return cleanPhone(
      readQuery("phone") ||
        readQuery("tel") ||
        readQuery("p") ||
        readSessionPhoneFromJson([
          "DIGIY_SESSION",
          "DIGIY_ACCESS",
          "DIGIY_LOC_SESSION",
          "DIGIY_DRIVER_SESSION",
          "DIGIY_RESA_SESSION",
          "DIGIY_MARKET_SESSION",
          "DIGIY_POS_SESSION",
          "DIGIY_BUILD_SESSION",
          "DIGIY_EXPLORE_SESSION",
          "DIGIY_JOBS_SESSION",
          "DIGIY_RESTO_SESSION"
        ]) ||
        readStorage([
          "DIGIY_PHONE",
          "DIGIY_LAST_PHONE",
          "DIGIY_SESSION_PHONE",
          "DIGIY_DRIVER_PHONE",
          "DIGIY_LOC_PHONE",
          "DIGIY_RESA_PHONE",
          "DIGIY_MARKET_PHONE",
          "DIGIY_POS_PHONE",
          "DIGIY_BUILD_PHONE",
          "DIGIY_EXPLORE_PHONE",
          "DIGIY_JOBS_PHONE",
          "DIGIY_RESTO_PHONE"
        ])
    );
  }

  function cacheKey(phone, module) {
    return `${STORAGE_PREFIX}:${upperModule(module)}:${cleanPhone(phone)}`;
  }

  function getCached(phone, module, ttlMs) {
    try {
      const raw = localStorage.getItem(cacheKey(phone, module));
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.saved_at) return null;
      if (now() - parsed.saved_at > ttlMs) return null;

      return parsed;
    } catch (_) {
      return null;
    }
  }

  function setCached(phone, module, payload) {
    try {
      localStorage.setItem(
        cacheKey(phone, module),
        JSON.stringify({
          ...payload,
          saved_at: now()
        })
      );
    } catch (_) {}
  }

  function savePhone(phone, module) {
    const p = cleanPhone(phone);
    const m = upperModule(module);

    if (!p) return;

    try {
      localStorage.setItem("DIGIY_LAST_PHONE", p);
      localStorage.setItem(`DIGIY_${m}_PHONE`, p);
    } catch (_) {}
  }

  function ensureSupabase(url, key) {
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("SUPABASE_JS_NOT_LOADED");
    }

    return window.supabase.createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
  }

  function normalizeRpcRow(data) {
    if (typeof data === "boolean") {
      return { has_access: data };
    }

    if (Array.isArray(data)) {
      return data[0] || {};
    }

    return data || {};
  }

  async function checkAccess(options) {
    const opts = options || {};

    const module = upperModule(
      opts.module ||
        readQuery("module") ||
        window.DIGIY_ABOS_MODULE ||
        window.DIGIY_MODULE
    );

    const phone = cleanPhone(opts.phone || guessPhone());
    const ttlMs = Number(opts.ttlMs || DEFAULT_TTL_MS);

    cleanVisibleUrl();

    if (!module) {
      return {
        ok: false,
        has_access: false,
        error: "MODULE_REQUIRED"
      };
    }

    /*
      PAY est transverse.
      Si une page déclare explicitement :
      window.DIGIY_TRANSVERSE_MODULE = true
      on ne bloque pas avec ABOS.
    */
    if (module === "PAY" && window.DIGIY_TRANSVERSE_MODULE === true) {
      return {
        ok: true,
        has_access: true,
        module,
        phone: phone || null,
        transverse: true
      };
    }

    if (!phone) {
      return {
        ok: false,
        has_access: false,
        error: "PHONE_REQUIRED",
        module
      };
    }

    savePhone(phone, module);

    if (opts.useCache !== false) {
      const cached = getCached(phone, module, ttlMs);
      if (cached) return { ...cached, from_cache: true };
    }

    const url =
      opts.supabaseUrl ||
      window.DIGIY_SUPABASE_URL ||
      DEFAULT_SUPABASE_URL;

    const key =
      opts.supabaseKey ||
      window.DIGIY_SUPABASE_KEY ||
      window.DIGIY_SUPABASE_ANON_KEY ||
      window.DIGIY_SUPABASE_ANON ||
      DEFAULT_SUPABASE_KEY;

    let sb;

    try {
      sb = ensureSupabase(url, key);
    } catch (e) {
      return {
        ok: false,
        has_access: false,
        error: e.message || "SUPABASE_CLIENT_ERROR",
        module,
        phone
      };
    }

    const { data, error } = await sb.rpc("digiy_has_module_access_from_abos", {
      p_phone: phone,
      p_module: module
    });

    if (error) {
      return {
        ok: false,
        has_access: false,
        error: error.message || "SUPABASE_RPC_ERROR",
        code: error.code || null,
        details: error.details || null,
        module,
        phone
      };
    }

    const row = normalizeRpcRow(data);

    const hasAccess = !!(
      row.has_access === true ||
      row.access === true ||
      row.ok === true ||
      row === true
    );

    const payload = {
      ok: true,
      has_access: hasAccess,
      phone,
      module,
      plan: row.plan || null,
      fiche_title: row.fiche_title || row.title || null,
      expires_at: row.expires_at || row.expire_at || null,
      module_rights: Array.isArray(row.module_rights) ? row.module_rights : []
    };

    setCached(phone, module, payload);

    return payload;
  }

  function buildDeniedUrl(options) {
    const opts = options || {};

    const module = upperModule(
      opts.module ||
        readQuery("module") ||
        window.DIGIY_ABOS_MODULE ||
        window.DIGIY_MODULE ||
        ""
    );

    const base = opts.payUrl || opts.deniedUrl || "./pin.html";

    try {
      const url = new URL(base, window.location.href);

      /*
        Important :
        on ne remet PAS le téléphone dans l’URL visible par défaut.
        Si une ancienne page en a vraiment besoin, elle doit passer exposePhone:true.
      */
      if (opts.exposePhone === true) {
        const phone = cleanPhone(opts.phone || guessPhone());
        if (phone) url.searchParams.set("phone", phone);
      }

      if (module) url.searchParams.set("module", module);
      url.searchParams.set("reason", opts.reason || "abos_required");

      return url.toString();
    } catch (_) {
      return base;
    }
  }

  async function protect(options) {
    const opts = options || {};
    const result = await checkAccess(opts);

    if (result.ok && result.has_access) {
      if (typeof opts.onAllowed === "function") opts.onAllowed(result);
      return result;
    }

    if (typeof opts.onDenied === "function") {
      opts.onDenied(result);
      return result;
    }

    if (opts.redirect !== false) {
      window.location.href = buildDeniedUrl({
        ...opts,
        reason: result.error || "abos_required"
      });
    }

    return result;
  }

  function renderAccessBadge(target, result) {
    const el =
      typeof target === "string"
        ? document.querySelector(target)
        : target;

    if (!el || !result) return;

    if (result.has_access) {
      el.innerHTML = `
        <strong>✅ Accès actif</strong><br>
        ${result.fiche_title || result.module || "Module DIGIY"}<br>
        <small>Expire : ${result.expires_at || "date suivie par DIGIY"}</small>
      `;
    } else {
      el.innerHTML = `
        <strong>🔒 Accès à vérifier</strong><br>
        <small>PAY garde la preuve, ADMIN valide, puis le module s’ouvre.</small>
      `;
    }
  }

  window.DIGIY_ABOS_ACCESS = {
    version: "abos-access-safe-no-phone-20260603",
    checkAccess,
    protect,
    renderAccessBadge,
    guessPhone,
    cleanPhone,
    upperModule,
    cleanVisibleUrl,
    buildDeniedUrl
  };
})();
