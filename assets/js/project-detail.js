/* Render a dedicated project landing page from the shared portfolio data. */
(function () {
  "use strict";

  var slug = document.body.getAttribute("data-project-slug");
  var project = (window.PROJECTS || []).filter(function (item) {
    return item && item.slug === slug;
  })[0];
  var content = document.getElementById("project-content");
  var fallback = document.getElementById("project-fallback");
  if (!project || !content) return;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function externalLinks() {
    return (project.links || []).filter(function (link) {
      return link && link.href && link.label !== "Project page";
    });
  }

  function linkMarkup(link, index) {
    var external = /^https?:/i.test(link.href);
    return "<a class='btn " + (index === 0 ? "btn-primary" : "btn-ghost") + "' href='" +
      esc(link.href) + "'" + (external ? " target='_blank' rel='noopener noreferrer'" : "") + ">" +
      esc(link.label || "Open link") + (external ? " <span aria-hidden='true'>↗</span>" : "") + "</a>";
  }

  function initials(title) {
    return String(title || "Project").split(/[\s\-–]+/).filter(Boolean).slice(0, 2)
      .map(function (word) { return word.charAt(0); }).join("").toUpperCase();
  }

  function stepList(items) {
    if (!Array.isArray(items) || !items.length) {
      return "<p class='project-step-empty'>See the source repository for current instructions.</p>";
    }
    return "<ol class='guide-steps'>" + items.map(function (step) {
      return "<li class='guide-step'>" +
        "<p><strong>" + esc(step.step || "Step") + "</strong></p>" +
        (step.note ? "<p class='guide-step-note'>" + esc(step.note) + "</p>" : "") +
        (step.command ? "<div class='guide-code'><code>" + esc(step.command) + "</code></div>" : "") +
        "</li>";
    }).join("") + "</ol>";
  }

  function setMeta(selector, value) {
    var meta = document.querySelector(selector);
    if (meta && value) meta.setAttribute("content", value);
  }

  var tags = project.tags || [];
  var links = externalLinks();
  var details = project.description || project.blurb || "Project details and setup information.";
  var highlights = project.highlights || [];
  var title = project.title || "Project";
  var year = project.year || "";
  var status = project.status || "";
  var metaDescription = (project.blurb || details).slice(0, 240);
  var canonical = "https://mob5824m-wq.github.io/" + String(project.page || "").replace(/^\/+|\/+$/g, "") + "/";

  document.title = title + " — mob5824 Projects";
  setMeta("meta[name='description']", metaDescription);
  setMeta("meta[property='og:title']", title + " — mob5824 Projects");
  setMeta("meta[property='og:description']", metaDescription);
  setMeta("meta[property='og:url']", canonical);
  var canonicalLink = document.querySelector("link[rel='canonical']");
  if (canonicalLink) canonicalLink.setAttribute("href", canonical);

  var featureHtml = highlights.length
    ? "<div class='product-feature-grid'>" + highlights.map(function (text, index) {
        return "<article class='product-feature-card project-fact-card'>" +
          "<span class='project-index' aria-hidden='true'>" + String(index + 1).padStart(2, "0") + "</span>" +
          "<p>" + esc(text) + "</p>" +
        "</article>";
      }).join("") + "</div>"
    : "<div class='project-status-card'><span class='project-index'>IN PROGRESS</span><p>Public feature and setup documentation is not available yet. Check the linked repositories for updates.</p></div>";

  var actions = links.length
    ? links.slice(0, 2).map(linkMarkup).join("")
    : "<a class='btn btn-ghost' href='../'>All projects</a>";
  var metaTags = tags.map(function (tag) { return "<li>" + esc(tag) + "</li>"; }).join("");
  var footerLinks = links.map(function (link) {
    var external = /^https?:/i.test(link.href);
    return "<a href='" + esc(link.href) + "'" + (external ? " target='_blank' rel='noopener noreferrer'" : "") + ">" +
      esc(link.label || "Project link") + (external ? " ↗" : "") + "</a>";
  }).join("");

  content.innerHTML = "" +
    "<section class='product-hero container' aria-labelledby='project-title'>" +
      "<div class='product-copy'>" +
        "<p class='product-kicker'><span class='product-kicker-dot' aria-hidden='true'></span>" +
          esc([year, status].filter(Boolean).join(" · ") || "Project overview") + "</p>" +
        "<h1 class='product-title' id='project-title'><span class='product-gradient'>" + esc(title) + "</span></h1>" +
        "<p class='product-lede'>" + esc(project.blurb || details) + "</p>" +
        "<div class='product-actions'>" + actions + "</div>" +
        (metaTags ? "<ul class='product-meta' aria-label='Project tags'>" + metaTags + "</ul>" : "") +
      "</div>" +
      "<figure class='product-visual project-detail-visual'>" +
        "<div class='project-identity'>" +
          "<span class='project-monogram' aria-hidden='true'>" + esc(initials(title)) + "</span>" +
          "<p class='project-identity-kicker'>PROJECT / " + esc(year || "OPEN SOURCE") + "</p>" +
          "<strong class='project-identity-title'>" + esc(title) + "</strong>" +
          "<p class='project-identity-copy'>" + esc(tags.slice(0, 3).join(" · ") || "Independent software") + "</p>" +
          "<span class='project-identity-status'>" + esc(status || "Project") + "</span>" +
        "</div>" +
        "<figcaption class='visual-caption'>Built by mob5824 · " + esc(year) + "</figcaption>" +
      "</figure>" +
    "</section>" +
    "<section class='container' aria-label='Project summary'>" +
      "<div class='project-summary-card'><p class='product-section-kicker'>Overview</p><p>" + esc(details) + "</p></div>" +
    "</section>" +
    "<section class='product-section container' id='features' aria-labelledby='features-title'>" +
      "<div class='product-section-head'>" +
        "<p class='product-section-kicker'>Inside the project</p>" +
        "<h2 class='product-section-title' id='features-title'>What it does.</h2>" +
        "<p class='product-section-sub'>A quick tour of the main capabilities, requirements, and project boundaries.</p>" +
      "</div>" + featureHtml +
    "</section>" +
    "<section class='product-section container' id='install-usage' aria-labelledby='install-usage-title'>" +
      "<div class='product-section-head'>" +
        "<p class='product-section-kicker'>Installation &amp; use</p>" +
        "<h2 class='product-section-title' id='install-usage-title'>Get started.</h2>" +
        "<p class='product-section-sub'>Follow the project-specific notes below; check the repository for the latest platform requirements.</p>" +
      "</div>" +
      "<div class='install-guide-grid'>" +
        "<section class='guide-card' aria-labelledby='install-title'><h3 id='install-title'>Installation</h3>" + stepList(project.install) + "</section>" +
        "<section class='guide-card' aria-labelledby='usage-title'><h3 id='usage-title'>How to use it</h3>" + stepList(project.usage) + "</section>" +
      "</div>" +
      "<div class='project-disclaimer'><strong>Check before installing.</strong> " +
        "This overview is a guide, not a substitute for the project README. Review its current compatibility, security, and licensing notes before use." +
      "</div>" +
      "<div class='product-legal-links' aria-label='Project source links'>" + footerLinks + "<a href='../'>All projects</a></div>" +
    "</section>";

  content.hidden = false;
  if (fallback) fallback.hidden = true;
})();
