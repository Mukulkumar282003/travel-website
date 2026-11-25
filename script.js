document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Keep travel dates in the future.
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  [$("#planner-date"), $("#enquiry-date")].filter(Boolean).forEach(input => input.min = todayString);

  // Accessible mobile navigation.
  const menuToggle = $(".menu-toggle");
  const navLinks = $(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });
    $$("a", navLinks).forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    }));
  }

  // Destination live search.
  const search = $("#destination-search");
  const destinationCards = $$(".destination-card");
  const destinationCount = $("#destination-count");
  if (search && destinationCards.length) {
    const filterDestinations = () => {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      destinationCards.forEach(card => {
        const matches = card.textContent.toLowerCase().includes(term);
        card.hidden = !matches;
        if (matches) visible++;
      });
      if (destinationCount) destinationCount.textContent = `Showing ${visible} of ${destinationCards.length} destinations`;
    };
    search.addEventListener("input", filterDestinations);
  }

  // Quick planner fills the enquiry form and scrolls to it.
  const plannerForm = $(".booking-box");
  const enquiryForm = $(".enquiry-form");
  if (plannerForm && enquiryForm) {
    plannerForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!plannerForm.reportValidity()) return;
      const destination = $("#planner-destination")?.value;
      const date = $("#planner-date")?.value;
      const travelers = $("#planner-travelers")?.value;
      if ($("#enquiry-destination")) $("#enquiry-destination").value = destination;
      if ($("#enquiry-date")) $("#enquiry-date").value = date;
      if ($("#enquiry-travelers")) $("#enquiry-travelers").value = travelers;
      $("#enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
      $("#visitor-name")?.focus({ preventScroll: true });
    });
  }

  // Validate the enquiry and open the visitor's email app with a pre-filled message.
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = $("#visitor-name")?.value.trim() || "";
      const email = $("#visitor-email")?.value.trim() || "";
      const destination = $("#enquiry-destination")?.value || "";
      const date = $("#enquiry-date")?.value || "";
      const travelers = $("#enquiry-travelers")?.value || "";
      const message = $("#message")?.value.trim() || "No additional message";
      const status = $(".form-status");
      if (!enquiryForm.reportValidity()) return;
      if (name.length < 2) {
        if (status) status.textContent = "Please enter a name with at least 2 characters.";
        $("#visitor-name")?.focus();
        return;
      }
      const subject = `Travel enquiry: ${destination}`;
      const body = [
        `Name: ${name}`, `Email: ${email}`, `Destination: ${destination}`,
        `Travel date: ${date}`, `Travelers: ${travelers}`, `Message: ${message}`
      ].join("\n");
      if (status) status.textContent = "Opening your email app. Please review and press Send there to submit your enquiry.";
      window.location.href = `mailto:hello@explore.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // One FAQ open at a time.
  const faqItems = $$(".faq-item");
  faqItems.forEach(item => item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  }));

  // Back-to-top visibility.
  const backToTop = $(".back-to-top");
  if (backToTop) {
    const updateButton = () => backToTop.classList.toggle("is-visible", window.scrollY > 300);
    window.addEventListener("scroll", updateButton, { passive: true });
    updateButton();
  }

  // Smooth scrolling for on-page links.
  $$('a[href^="#"]').forEach(link => link.addEventListener("click", event => {
    const target = $(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  const footerText = $(".footer-bottom p");
  if (footerText) footerText.textContent = `© ${new Date().getFullYear()} Explore World. All Rights Reserved.`;
});
