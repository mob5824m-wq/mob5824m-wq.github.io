/* Shared interactions for product landing pages and legal pages. */
(function () {
  "use strict";

  var root = document.documentElement;
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
  if (!savedTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    savedTheme = "light";
  }
  root.setAttribute("data-theme", savedTheme || "dark");

  var themeButton = document.querySelector(".theme-toggle");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var menuButton = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-links");
  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  var legalLinks = document.querySelectorAll(".legal-nav a");
  var legalCards = document.querySelectorAll(".legal-card");
  if ("IntersectionObserver" in window && legalLinks.length && legalCards.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        legalLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    legalCards.forEach(function (card) { observer.observe(card); });
  }
})();
