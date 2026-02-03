// /js/partials.js
(function () {
  const isLocal = location.protocol === "file:";

  /* -----------------------------------------
     ✅ BASE PATH (future-proof)
     - If site is hosted at root: "/" stays "/"
     - If hosted in subfolder: "/mirah/" auto-detected
  ----------------------------------------- */
  function getBasePath() {
    // If you ever set <base href="/mirah/"> then use that
    const baseTag = document.querySelector('base[href]');
    if (baseTag) return baseTag.getAttribute('href') || '/';

    // Default: root
    // (If you want subfolder support without base tag, you can hardcode here later)
    return '/';
  }

  const BASE = getBasePath().replace(/\/+$/, '/') ; // ensure trailing slash

  // ✅ define partial paths (root-safe for Netlify/Hostinger)
  const PARTIALS = {
    header: `${BASE}partials/header.html`,
    footer: `${BASE}partials/footer.html`,
  };

  // ✅ which page is active?
// ✅ which page is active?
function detectActiveKey() {
  const p = (location.pathname || "/").toLowerCase();

  // home
  if (p === "/" || p.endsWith("/index.html")) return "home";

  // ✅ IMPORTANT: solutions page fix
  if (p.includes("solutions")) return "solutions";

  // (optional) features page ko bhi solutions hi highlight rakhna hai
  if (p.includes("features")) return "solutions";

  if (p.includes("pricing")) return "pricing";
  if (p.includes("enterprise")) return "enterprise";
  if (p.includes("l")) return "learn";
  if (p.includes("about")) return "about";
  if (p.includes("contact")) return "contact";
  if (p.includes("auth")) return "login";

  return ""; // no highlight
}


  function setActiveNav(activeKey) {
    // if empty => do nothing (safe)
    if (!activeKey) return;

    // desktop
    document.querySelectorAll('.nav__link[data-nav]').forEach(a => {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === activeKey);
    });

    // mobile
    document.querySelectorAll('.drawer__item[data-nav]').forEach(a => {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === activeKey);
    });
  }

  function setFooterYear() {
    const y = document.getElementById("footerYear");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  async function loadPartial(type, url) {
    const mount = document.querySelector(`[data-partial="${type}"]`);
    if (!mount) return;

    // ⚠️ Local file mode cannot fetch properly
    if (isLocal) {
      mount.innerHTML =
        `<div style="padding:12px;border:1px solid rgba(0,0,0,.1);border-radius:12px;font:12px Inter,system-ui;">
          Partials loader needs a local server (Live Server / Vite). <b>file://</b> mode blocks fetch.
        </div>`;
      return;
    }

    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${type}: ${res.status}`);
    mount.innerHTML = await res.text();
  }

  async function boot() {
    // 1) inject header + footer
    await loadPartial("header", PARTIALS.header);
    await loadPartial("footer", PARTIALS.footer);

    // 2) now header exists => set active nav
    setActiveNav(detectActiveKey());

    // 3) footer year
    setFooterYear();

    // 4) let other scripts know DOM is ready
    window.dispatchEvent(new CustomEvent("partials:loaded"));
  }

  boot().catch(err => console.error("partials error:", err));
})();













(function () {
  /* =========================================
     CONFIG
  ========================================= */
  const WA_NUMBER = "923143093944"; // ✅ Apna number yahan check kar lo
  const WA_HTML_PATH = "/partials/whatsapp.html"; // Path to your HTML file

  /* =========================================
     1. INJECT HTML AUTOMATICALLY
  ========================================= */
  async function loadWidget() {
    // Agar pehle se widget hai to load mat karo
    if (document.getElementById("waWidget")) return;

    try {
      const res = await fetch(WA_HTML_PATH);
      if (!res.ok) throw new Error("WhatsApp HTML file nahi mila");
      
      const html = await res.text();
      const div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);

      // HTML inject hone ke baad logic start karo
      initLogic();

    } catch (err) {
      console.error("WhatsApp Widget Load Error:", err);
    }
  }

  /* =========================================
     2. WIDGET FUNCTIONALITY
  ========================================= */
  function initLogic() {
    const btn = document.getElementById("waBtn");
    const box = document.getElementById("waBox");
    const close = document.getElementById("waClose");
    const send = document.getElementById("waSend");
    const input = document.getElementById("waInput");

    if (!btn || !box || !input) return;

    // --- Toggle Chat ---
    const toggle = () => {
      const isActive = box.classList.contains("is-active");
      
      if (isActive) {
        box.classList.remove("is-active");
        setTimeout(() => box.style.visibility = "hidden", 300); // Wait for transition
      } else {
        box.style.visibility = "visible";
        box.classList.add("is-active");
        setTimeout(() => input.focus(), 100);
      }
    };

    // --- Send Message ---
    const doSend = () => {
      const text = input.value.trim();
      // Default message agar khali ho
      const msg = text || "Hi Mirah Tools, I need assistance.";
      
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      
      // Optional: Send ke baad box band karna hai to uncomment karo:
      // toggle(); 
    };

    // --- Auto-Resize Textarea (Max 5 Lines) ---
    input.addEventListener("input", function() {
      this.style.height = "auto"; // Reset height
      
      // Calculate new height (max-height CSS mein 120px set hai jo ~5 lines hai)
      // ScrollHeight content ke hisaab se badhega
      this.style.height = (this.scrollHeight) + "px";
      
      // Agar text remove ho jaye aur single line bache
      if(this.value === '') {
        this.style.height = ''; 
      }
    });

    // --- Event Listeners ---
    btn.addEventListener("click", toggle);
    close.addEventListener("click", toggle);
    
    send.addEventListener("click", doSend);

    // Enter to Send (Shift+Enter for new line)
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Default new line roko
        doSend();
      }
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("is-active")) {
        toggle();
      }
    });
  }

  // --- Start ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadWidget);
  } else {
    loadWidget();
  }

})();






































/**
 * =========================================================
 * 🚀 MIRAH TOOLS - PRECISE ID-BASED HIGHLIGHTER
 * Description: Targets specific unique IDs for 100% accuracy
 * Author: Senior Dev Patch
 * =========================================================
 */

(function initPreciseNav() {
  
  // 1. CONFIG: Map Pages to their Target IDs (Desktop & Mobile)
  const ID_MAP = {
    'contact':    ['nav-d-contact', 'nav-m-contact'],
    'about':      ['nav-d-about',   'nav-m-about'],
    'solutions':  ['nav-d-solutions','nav-m-solutions'],
    'pricing':    ['nav-d-pricing', 'nav-m-pricing'],
    'enterprise': ['nav-d-enterprise','nav-m-enterprise'],
    'learn':      ['nav-d-learn',   'nav-m-learn'],
    'login':      ['nav-d-login',   'nav-m-login'], // (Desktop login usually has no nav link style, but mobile does)
    'home':       ['nav-d-home',    'nav-m-home']
  };

  /**
   * 🔎 STEP 1: Determine Current Page Key
   * Uses Strict Keyword matching from URL
   */
  function getCurrentPageKey() {
    const path = window.location.pathname.toLowerCase();

    // Specific Checks (Order Matters)
    if (path.includes('contact.html') || path.includes('/contact/')) return 'contact';
    if (path.includes('about.html') || path.includes('/about/')) return 'about';
    if (path.includes('solutions.html') || path.includes('/solutions/')) return 'solutions';
    if (path.includes('features.html')) return 'solutions';
    if (path.includes('pricing.html') || path.includes('/pricing/')) return 'pricing';
    if (path.includes('enterprise.html') || path.includes('/enterprise/')) return 'enterprise';
    
    // Strict Learn Check (avoids folder name conflicts)
    if (path.includes('learn.html') || path.includes('/learn/') || path.includes('/blog/')) return 'learn';

    // Auth
    if (path.includes('auth.html') || path.includes('login') || path.includes('signup')) return 'login';

    // Home (Fallback)
    if (path === '/' || path.endsWith('/index.html')) return 'home';

    return '';
  }

  /**
   * 🎨 STEP 2: Apply Highlight by ID
   */
  function highlightNav() {
    const key = getCurrentPageKey();
    if (!key) return true; // Stop if unknown page

    // A. Check if Header is loaded (Look for nav wrapper)
    const navWrap = document.getElementById('navWrap');
    if (!navWrap) return false; // Header not ready, retry

    // B. NUCLEAR CLEANUP (SAFE MODE) 🛡️
    // FIX: Pehle yeh har jagah se 'is-active' hata raha tha (images/sliders se bhi).
    // Ab hum sirf .nav__link aur .drawer__item ko target kar rahe hain.
    document.querySelectorAll('.nav__link.is-active, .drawer__item.is-active').forEach(el => {
      el.classList.remove('is-active');
    });

    // C. PRECISE TARGETING 🎯
    // Get the array of IDs for this page (e.g., ['nav-d-about', 'nav-m-about'])
    const targetIds = ID_MAP[key];

    if (targetIds) {
      targetIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add('is-active');
        }
      });
      return true; // Success
    }

    return false; // Retry
  }

  // 🔄 POLLING OBSERVER (Wait for Header HTML to inject)
  const interval = setInterval(() => {
    const isSuccess = highlightNav();
    if (isSuccess) {
      clearInterval(interval);
    }
  }, 50);

  // Stop after 3 seconds to save resources
  setTimeout(() => clearInterval(interval), 3000);

})();