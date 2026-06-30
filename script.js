// Fade-in on scroll
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".fade-in").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
  fadeObserver.observe(el);
});

// Elements
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const backToTop = document.querySelector(".back-to-top");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const body = document.body;

let savedScrollY = 0;

function lockScroll() {
  savedScrollY = window.scrollY;
  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
}

function unlockScroll() {
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  window.scrollTo(0, savedScrollY);
}

function scrollToTarget(target) {
  const header = document.querySelector(".site-header");
  const offset = header ? header.offsetHeight : 0;
  const y = target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}

function openMenu() {
  lockScroll();
  navPanel.classList.add("open");
  navToggle.classList.add("active");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
  body.classList.add("menu-open");
}

function closeMenu() {
  navPanel.classList.remove("open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  body.classList.remove("menu-open");

  unlockScroll();
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navPanel.classList.contains("open") ? closeMenu() : openMenu();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navPanel.classList.contains("open")) {
    closeMenu();
  }
});

// Tap/click handling for the drawer links, including Get in Touch
if (navPanel) {
  navPanel.addEventListener("click", (e) => {
    const link = e.target.closest("a[href^='#']");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    closeMenu();

    setTimeout(() => {
      scrollToTarget(target);
    }, 80);
  });
}

// Smooth scroll for all other hash links outside the mobile drawer
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  if (anchor.closest(".nav-panel")) return;

  const href = anchor.getAttribute("href");
  if (!href || href === "#") return;

  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    scrollToTarget(target);
  });
});

// Active nav highlight on scroll
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.32, rootMargin: "-18% 0px -58% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// Back to top
window.addEventListener("scroll", () => {
  if (!backToTop) return;
  backToTop.classList.toggle("visible", window.scrollY > 460);
});

// Contact form
const form = document.getElementById("contactForm");
const toast = document.getElementById("successToast");
const submitBtn = document.querySelector(".submit-btn");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();

        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";

        if (toast) {
          toast.textContent = "Message sent successfully.";
          toast.classList.add("show");

          setTimeout(() => {
            toast.classList.remove("show");
          }, 4000);
        }
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error(error);

      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";

      if (toast) {
        toast.textContent = "Something went wrong. Please try again.";
        toast.classList.add("show");

        setTimeout(() => {
          toast.classList.remove("show");
        }, 4000);
      }
    }
  });
}
