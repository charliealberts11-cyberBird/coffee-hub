const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const counters = document.querySelectorAll("[data-count]");

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  }
});

const formatCount = (value, counter) => {
  const decimals = Number(counter.dataset.decimals || 0);
  const suffix = counter.dataset.suffix || "";
  const rounded = decimals ? value.toFixed(decimals) : Math.round(value);
  const formatted = counter.dataset.format === "comma"
    ? new Intl.NumberFormat("en-US").format(Number(rounded))
    : rounded;

  return `${formatted}${suffix}`;
};

const animateCounter = (counter) => {
  if (counter.dataset.done) return;
  counter.dataset.done = "true";

  const target = Number(counter.dataset.target || 0);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatCount(target * eased, counter);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = formatCount(target, counter);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => observer.observe(counter));
} else {
  counters.forEach(animateCounter);
}
