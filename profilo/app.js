(() => {
  "use strict";

  // Helpers
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));
  const root = document.documentElement;

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // Theme
  const themeToggle = $("#themeToggle");
  const storedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      themeToggle?.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      themeToggle?.setAttribute("aria-pressed", "false");
    }
    localStorage.setItem("theme", theme);
  }

  applyTheme(storedTheme ?? (prefersLight ? "light" : "dark"));

  themeToggle?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
    toast(isLight ? "تم التبديل للوضع الداكن" : "تم التبديل للوضع الفاتح");
  });

  // Mobile Nav
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  function setNavOpen(open) {
    navMenu?.classList.toggle("is-open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
  }

  navToggle?.addEventListener("click", () => {
    setNavOpen(!navMenu?.classList.contains("is-open"));
  });

  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    const t = e.target;
    const inside = navMenu.contains(t) || navToggle.contains(t);
    if (!inside && navMenu.classList.contains("is-open")) setNavOpen(false);
  });

  $$('a[href^="#"]', navMenu).forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });

  // Scroll Progress Bar
  const scrollBar = $("#scrollBar");
  function updateScrollBar() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${progress}%`;
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });
  updateScrollBar();

  // Spotlight
  const spotlight = $("#spotlight");
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!spotlight) return;
      spotlight.style.setProperty("--x", `${e.clientX}px`);
      spotlight.style.setProperty("--y", `${e.clientY}px`);
    },
    { passive: true }
  );

  // Reveal
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  // Active section
  const navLinks = $$(".nav__link");
  const sections = navLinks.map((l) => $(l.getAttribute("href"))).filter(Boolean);

  const sectionIO = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      navLinks.forEach((l) => l.classList.remove("is-active"));
      const id = visible.target.id;
      const active = navLinks.find((l) => l.getAttribute("href") === `#${id}`);
      active?.classList.add("is-active");
    },
    { threshold: [0.2, 0.35, 0.5], rootMargin: "-10% 0px -70% 0px" }
  );
  sections.forEach((s) => sectionIO.observe(s));

  // Typing
  const typingTarget = $("#typingTarget");
  const typingText = "Software Engineer / Full-Stack Developer";
  let idx = 0;
  function type() {
    if (!typingTarget) return;
    typingTarget.textContent = typingText.slice(0, idx++);
    if (idx <= typingText.length) requestAnimationFrame(type);
  }
  setTimeout(type, 250);

  // Magnetic Buttons (خفيف)
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px)`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
  });

  // Copy Email
  const copyEmailBtn = $("#copyEmailBtn");
  copyEmailBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("alshawsh161@gmail.com");
      toast("تم نسخ البريد ✅");
    } catch {
      toast("لم يتم النسخ — انسخه يدويًا");
    }
  });

  // 3D Tilt Hero Card (بدون تخريب transforms)
  const heroCard = $("#heroCard");
  if (heroCard) {
    const strength = 10;
    heroCard.addEventListener("pointermove", (e) => {
      const r = heroCard.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -strength;
      const ry = (px - 0.5) * strength;
      heroCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    heroCard.addEventListener("pointerleave", () => (heroCard.style.transform = ""));
  }

  // Projects Data
  const projects = [
    {
      id: "p1",
      title: "نظام إدارة خدمات (Full-Stack)",
      type: "fullstack",
      tech: ["Laravel", "PHP", "JS", "CSS"],
      problem: "تنظيم عمليات الخدمة وإدارة الطلبات والمتابعة والتقارير داخل واجهة واضحة.",
      solution: "لوحة تحكم + تدفق طلبات + فصل الواجهة عن منطق الأعمال + بنية قابلة للتوسع.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=70",
      github: "",
      demo: ""
    },
    {
      id: "p2",
      title: "واجهة تفاعلية متجاوبة (Frontend)",
      type: "frontend",
      tech: ["HTML", "CSS", "JavaScript"],
      problem: "واجهة تحتاج سرعة، وضوح، وتجربة ممتازة على الجوال.",
      solution: "Design System صغير + مكونات قابلة لإعادة الاستخدام + أداء عالي + Motion خفيف.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=70",
      github: "",
      demo: ""
    },
    {
      id: "p3",
      title: "تطبيق مكتبي بواجهة GUI (Desktop)",
      type: "desktop",
      tech: ["Java", "JavaFX"],
      problem: "تنفيذ وظائف داخلية بواجهة سهلة مع حفظ/عرض بيانات.",
      solution: "واجهات منظمة + Events واضحة + قابلية تطوير لاحقة.",
      image: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=1400&q=70",
      github: "",
      demo: ""
    }
  ];

  const grid = $("#projectsGrid");
  const modal = $("#projectModal");
  const modalContent = $("#modalContent");

  function typeLabel(t) {
    return ({ fullstack: "Full-Stack", frontend: "Frontend", backend: "Backend", desktop: "Desktop" }[t] || "Project");
  }

  function renderProjects(filter = "all") {
    if (!grid) return;
    const list = filter === "all" ? projects : projects.filter((p) => p.type === filter);

    grid.innerHTML = list
      .map((p) => `
        <article class="project" data-id="${p.id}" tabindex="0" role="button" aria-label="فتح تفاصيل ${p.title}">
          <div class="project__media">
            <img src="${p.image}" alt="صورة توضيحية لمشروع: ${p.title}" loading="lazy" />
          </div>
          <div class="project__body">
            <div class="project__top">
              <h3 class="project__title">${p.title}</h3>
              <span class="pill">${typeLabel(p.type)}</span>
            </div>

            <div class="project__meta">Tech: ${p.tech.join(" • ")}</div>

            <p class="muted" style="margin-top:10px;">
              <strong>المشكلة:</strong> ${p.problem}<br/>
              <strong>الحل:</strong> ${p.solution}
            </p>

            <div class="project__actions">
              <span class="btn btn--ghost" aria-disabled="true">${p.github ? "GitHub" : "GitHub (قريباً)"}</span>
              <span class="btn btn--ghost" aria-disabled="true">${p.demo ? "Demo" : "Demo (قريباً)"}</span>
            </div>
          </div>
        </article>
      `)
      .join("");
  }

  function openModal(p) {
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal__hero">
        <img src="${p.image}" alt="صورة مشروع: ${p.title}" loading="lazy" />
      </div>

      <div class="modal__body">
        <h3 style="margin:0">${p.title}</h3>
        <div class="meta">Type: ${typeLabel(p.type)} • Tech: ${p.tech.join(" • ")}</div>

        <div class="card" style="margin-top:12px;">
          <div class="card-title">Problem Statement</div>
          <p class="muted">${p.problem}</p>
        </div>

        <div class="card" style="margin-top:12px;">
          <div class="card-title">Solution Overview</div>
          <p class="muted">${p.solution}</p>
        </div>

        <div class="card" style="margin-top:12px;">
          <div class="card-title">Links</div>
          <p class="muted">أضف روابط GitHub/Demo لاحقًا وسأعرضها هنا بشكل احترافي.</p>
        </div>
      </div>
    `;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  renderProjects("all");

  // Filters
  $$(".filter").forEach((b) => {
    b.addEventListener("click", () => {
      $$(".filter").forEach((x) => x.classList.remove("is-on"));
      b.classList.add("is-on");
      renderProjects(b.dataset.filter);
      toast(`عرض المشاريع: ${b.textContent}`);
    });
  });

  // Open modal
  grid?.addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    if (!card) return;
    const p = projects.find((x) => x.id === card.dataset.id);
    if (p) openModal(p);
  });

  grid?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".project");
    if (!card) return;
    const p = projects.find((x) => x.id === card.dataset.id);
    if (p) openModal(p);
  });

  // Close modal
  modal?.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Contact validation and EmailJS integration
  const form = $("#contactForm");
  const statusEl = $("#formStatus");
  const submitBtn = form?.querySelector('button[type="submit"]');

  // EmailJS configuration (real keys from emailjs.com)
  const EMAILJS_PUBLIC_KEY = "b__Vof5DruC75dvNS"; // Public Key
  const EMAILJS_SERVICE_ID = "service_ia95439"; // Service ID
  const EMAILJS_TEMPLATE_ID = "template_5o7x25d"; // Template ID

  function setStatus(msg, type = "info") {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color =
      type === "success" ? "var(--green)" : type === "error" ? "var(--amber)" : "var(--muted)";
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "جاري الإرسال..." : "إرسال";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
  }

  // Initialize EmailJS
  (function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  })();

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (name.length < 2) return setStatus("الاسم قصير جداً.", "error");
    if (!validateEmail(email)) return setStatus("البريد الإلكتروني غير صحيح.", "error");
    if (message.length < 10) return setStatus("الرسالة قصيرة. اكتب تفاصيل أكثر.", "error");

    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY.includes("XXXX") || EMAILJS_SERVICE_ID.includes("xxxx") || EMAILJS_TEMPLATE_ID.includes("xxxx")) {
      setStatus("EmailJS غير مُعدّ. يرجى إعداد حساب EmailJS وإدخال المفاتيح الصحيحة في app.js.", "error");
      toast("يرجى إعداد EmailJS أولاً");
      return;
    }

    setLoading(true);
    setStatus("جاري إرسال الرسالة...", "info");

    // If dummy keys, simulate success for demonstration
    if (EMAILJS_PUBLIC_KEY === "user_dummy_public_key" || EMAILJS_SERVICE_ID === "service_dummy_id" || EMAILJS_TEMPLATE_ID === "template_dummy_id") {
      setTimeout(() => {
        setStatus("تم إرسال الرسالة بنجاح ✅ (محاكاة للعرض)", "success");
        toast("تم إرسال الرسالة بنجاح ✅");
        form.reset();
        setLoading(false);
      }, 2000); // Simulate delay
    } else {
      // Send email using EmailJS
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "alshawsh161@gmail.com"
      })
      .then(() => {
        setStatus("تم إرسال الرسالة بنجاح ✅", "success");
        toast("تم إرسال الرسالة بنجاح ✅");
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        setStatus("فشل في إرسال الرسالة. حاول مرة أخرى.", "error");
        toast("فشل في الإرسال — حاول مرة أخرى");
      })
      .finally(() => {
        setLoading(false);
      });
    }
  });

  form?.addEventListener("reset", () => setStatus(""));

})();
  // ======================
  // Footer enhancements
  // ======================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const toTopBtn = document.getElementById("toTopBtn");
  toTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const footerCopyEmail = document.getElementById("footerCopyEmail");
  footerCopyEmail?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("alshawsh161@gmail.com");
      toast("تم نسخ البريد ✅");
    } catch {
      toast("لم يتم النسخ — انسخه يدويًا");
    }
  });

  const footerForm = document.getElementById("footerForm");
  footerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("footerEmail");
    const email = String(input?.value || "").trim();

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!ok) return toast("اكتب بريد صحيح أولاً");

    toast("تمت إضافة بريدك ✅ (بدون إرسال فعلي)");
    footerForm.reset();
  });
