/* ============================================================
   PORTFOLIO — Interactivity
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  let preloaderDone = false;
  const finishPreloader = () => {
    if (preloaderDone) return;
    preloaderDone = true;
    document.body.classList.add("loaded");
    preloader.classList.add("hidden");
  };
  window.addEventListener("load", () => setTimeout(finishPreloader, 900));
  // Safety fallback
  setTimeout(finishPreloader, 3200);

  /* ---------- Custom cursor (fine pointers only) ---------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (window.matchMedia("(pointer: fine)").matches) {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });
    const rafLoop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(rafLoop);
    };
    rafLoop();
    document.querySelectorAll("a, button, input, textarea, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  }

  /* ---------- Navbar scroll state + active link ---------- */
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollProgress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");

  function onScrollNav() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);

    let current = "home";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.id;
      }
    });
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === "#" + current)
    );

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = pct + "%";
    toTop.classList.toggle("visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    menu.classList.toggle("open");
    if (menu.classList.contains("open")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      menu.classList.remove("open");
      document.body.style.overflow = "";
    })
  );

  /* ---------- Typing effect ---------- */
  const roles = [
    "Creative Developer",
    "Frontend Engineer",
    "Problem Solver",
    "UI/UX Enthusiast",
    "Tech Storyteller",
  ];
  const typeEl = document.getElementById("typeText");
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typeLoop() {
    const word = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      typeEl.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
      setTimeout(typeLoop, 80);
    } else {
      charIdx--;
      typeEl.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 350);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }
  typeLoop();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && document.body.classList.contains("loaded")) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Skill bars animate ---------- */
  const bars = document.querySelectorAll(".bar");
  const barIO = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector(".bar-fill");
          const level = fill.dataset.level;
          fill.style.width = level + "%";
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((b) => barIO.observe(b));

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    form.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));

    if (!name) {
      form.name.classList.add("error");
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.classList.add("error");
      valid = false;
    }
    if (!subject) {
      form.subject.classList.add("error");
      valid = false;
    }
    if (!message) {
      form.message.classList.add("error");
      valid = false;
    }

    if (!valid) {
      status.classList.add("error");
      status.textContent = "Oops! Isi semua kolom dengan benar ya.";
      return;
    }

    status.classList.add("success");
    status.textContent = "Terima kasih, pesanmu sudah siap dikirim! (maaf, ini demo)";
    form.reset();
  });

  /* ---------- Marquee: duplicate content for seamless loop ---------- */
  const marqueeInner = document.getElementById("marqueeInner");
  if (marqueeInner) {
    marqueeInner.innerHTML += marqueeInner.innerHTML;
  }

  /* ---------- Count-up stats ---------- */
  const statNums = document.querySelectorAll(".stat-num");
  const statIO = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.count;
          const duration = 1400;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((s) => statIO.observe(s));

  /* ---------- 3D tilt cards ---------- */
  const tiltCards = document.querySelectorAll(".skill-card");
  if (window.matchMedia("(pointer: fine)").matches) {
    tiltCards.forEach((card) => {
      let raf = null;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * 10;
        const rotX = (0.5 - py) * 10;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
      });
      card.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
        card.style.transition = "transform 0.5s var(--ease)";
        setTimeout(() => (card.style.transition = ""), 500);
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  const magneticBtns = document.querySelectorAll(".btn-primary");
  if (window.matchMedia("(pointer: fine)").matches) {
    magneticBtns.forEach((btn) => {
      btn.classList.add("magnetic");
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Mouse-follow glow (aurora) ---------- */
  const rootEl = document.documentElement;
  window.addEventListener(
    "mousemove",
    (e) => {
      rootEl.style.setProperty("--mx", e.clientX + "px");
      rootEl.style.setProperty("--my", e.clientY + "px");
    },
    { passive: true }
  );

  /* ---------- Card spotlight border ---------- */
  document.querySelectorAll(".skill-card, .stat, .contact-form").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--sp-x", x + "%");
      card.style.setProperty("--sp-y", y + "%");
    });
  });

  /* ---------- Particle constellation background ---------- */
  (function particles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    const CONNECT_DIST = 130;
    let particlesArr = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 14000));
      particlesArr = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particlesArr) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 163, 255, 0.7)";
        ctx.fill();

        if (!reduced) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          if (Math.hypot(mdx, mdy) < 170) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particlesArr.length; i++) {
        for (let j = i + 1; j < particlesArr.length; j++) {
          const a = particlesArr[i];
          const b = particlesArr[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / CONNECT_DIST) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (!reduced) requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("resize", resize);
    resize();

    if (reduced) {
      step();
    } else {
      requestAnimationFrame(step);
    }
  })();

  })();