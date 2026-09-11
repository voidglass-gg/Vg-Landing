// Replace this value with the final installer URL.
const DOWNLOAD_URL = "https://example.com/voidglass-download";
const DISCORD_URL = "https://discord.gg/2zJp7kP3J";

const languageSwitch = document.querySelector(".language-switch");
const languageLabels = languageSwitch
  ? languageSwitch.querySelectorAll("[data-language]")
  : [];

function setLanguage(language) {
  const translations = window.VOIDGLASS_LANG[language];
  if (!translations) return;

  document.documentElement.lang = language;
  document.title = translations["meta.title"];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translations[element.dataset.i18n];
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = translations[element.dataset.i18nAlt];
  });

  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.content = translations[element.dataset.i18nContent];
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translations[element.dataset.i18nAriaLabel]);
  });

  languageLabels.forEach((label) => {
    label.classList.toggle("active", label.dataset.language === language);
  });

  if (languageSwitch) {
    languageSwitch.setAttribute(
      "aria-label",
      language === "fr" ? "Switch to English" : "Passer en français"
    );
    localStorage.setItem("voidglass-language", language);
  }

}

if (languageSwitch) {
  languageSwitch.addEventListener("click", () => {
    setLanguage(document.documentElement.lang === "fr" ? "en" : "fr");
  });
}

document.querySelectorAll("[data-download]").forEach((link) => {
  link.href = DOWNLOAD_URL;
  link.addEventListener("click", () => {
    const eventPath = document.body.classList.contains("riot-review")
      ? "riot-dowload-standalone"
      : "download-standalone";

    window.goatcounter?.count?.({
      path: eventPath,
      event: true,
    });
  });
});

document.querySelectorAll("[data-discord]").forEach((link) => {
  link.href = DISCORD_URL;
});

const heroCarousel = document.querySelector(".hero-carousel");
if (heroCarousel) {
  const slides = heroCarousel.querySelectorAll("img");
  const progress = heroCarousel.querySelector(".carousel-progress");
  const heroVisual = heroCarousel.closest(".hero-visual");
  const carouselDelay = 5000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let autoAdvanceId;

  function resetProgress() {
    if (!progress) return;
    progress.classList.remove("is-running");
    if (!reduceMotion.matches) {
      void progress.offsetWidth;
      progress.classList.add("is-running");
    }
  }

  function showNextSlide() {
    const activeIndex = [...slides].findIndex((slide) => slide.classList.contains("is-active"));
    const nextIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.remove("is-active");
    slides[nextIndex].classList.add("is-active");
    resetProgress();
  }

  function showPreviousSlide() {
    const activeIndex = [...slides].findIndex((slide) => slide.classList.contains("is-active"));
    const previousIndex = (activeIndex - 1 + slides.length) % slides.length;
    slides[activeIndex].classList.remove("is-active");
    slides[previousIndex].classList.add("is-active");
    resetProgress();
  }

  function stopAutoAdvance() {
    window.clearInterval(autoAdvanceId);
    autoAdvanceId = undefined;
    progress?.classList.remove("is-running");
  }

  function startAutoAdvance() {
    if (reduceMotion.matches || document.hidden || autoAdvanceId) return;
    resetProgress();
    autoAdvanceId = window.setInterval(showNextSlide, carouselDelay);
  }

  function openCarousel() {
    heroCarousel.classList.add("is-expanded");
    document.body.classList.add("carousel-open");
    heroVisual?.classList.add("is-carousel-expanded");
  }

  function closeCarousel() {
    heroCarousel.classList.remove("is-expanded");
    document.body.classList.remove("carousel-open");
    heroVisual?.classList.remove("is-carousel-expanded");
  }

  heroCarousel.addEventListener("click", (event) => {
    if (event.target.closest(".carousel-close")) {
      closeCarousel();
      return;
    }

    if (heroCarousel.classList.contains("is-expanded")) {
      showNextSlide();
      stopAutoAdvance();
      startAutoAdvance();
      return;
    }

    openCarousel();
  });
  heroCarousel.addEventListener("mouseenter", stopAutoAdvance);
  heroCarousel.addEventListener("mouseleave", startAutoAdvance);
  heroCarousel.addEventListener("focusin", stopAutoAdvance);
  heroCarousel.addEventListener("focusout", startAutoAdvance);
  document.querySelectorAll("[data-carousel-direction]").forEach((control) => {
    control.addEventListener("click", () => {
      if (control.dataset.carouselDirection === "previous") showPreviousSlide();
      else showNextSlide();
      stopAutoAdvance();
      startAutoAdvance();
    });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoAdvance();
    else startAutoAdvance();
  });
  document.addEventListener("keydown", (event) => {
    if (!heroCarousel.classList.contains("is-expanded")) return;
    if (event.key === "Escape") {
      closeCarousel();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextSlide();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousSlide();
    }
  });
  document.addEventListener("click", (event) => {
    if (heroCarousel.classList.contains("is-expanded") && !heroVisual?.contains(event.target)) {
      closeCarousel();
    }
  });
  reduceMotion.addEventListener("change", () => {
    stopAutoAdvance();
    startAutoAdvance();
  });
  startAutoAdvance();
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const initialLanguage = languageSwitch
  ? localStorage.getItem("voidglass-language") || "fr"
  : document.documentElement.lang;
setLanguage(initialLanguage);
