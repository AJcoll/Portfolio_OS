// js/ui.js

const mainContentArea = document.getElementById("main-content-area");
const liveClock = document.getElementById("live-clock");

/**
 * Loads content into the main area from an HTML template.
 * @param {string} templateId The ID of the <template> element.
 */
function loadContent(templateId) {
  const template = document.getElementById(templateId);
  if (template) {
    mainContentArea.classList.add("loading");
    mainContentArea.scrollTop = 0; //

    setTimeout(() => {
      mainContentArea.innerHTML = "";
      const content = template.content.cloneNode(true);
      mainContentArea.appendChild(content);
      mainContentArea.classList.remove("loading");

      requestAnimationFrame(() => {
        // ← add this block
        mainContentArea.scrollTop = 0;
        // extra belt-and-suspenders: scroll the first element into view
        mainContentArea.firstElementChild?.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
      });

      // Re-run feather icons replacement on new content
      if (window.feather) {
        window.feather.replace();
      }
    }, 300);
  } else {
    console.error(`Template with ID "${templateId}" not found.`);
  }
}

/**
 * Handles all clicks within the main navigation and content area.
 * @param {Event} e The click event.
 */
function handleNavClick(e) {
  const target = e.target;

  // Check for a nav-link, back-link, or a button with a data-template
  const navElement = target.closest(".nav-link, .back-link");
  if (navElement) {
    e.preventDefault();
    const templateId = navElement.dataset.template;
    if (templateId) {
      loadContent(templateId);
      // Check if the link is in the main nav tree to set active state
      if (navElement.closest(".left-nav-tree .nav-link")) {
        document
          .querySelectorAll(".left-nav-tree .nav-link")
          .forEach((nav) => nav.classList.remove("active"));
        navElement.classList.add("active");
      }
      // Always close the mobile nav after a selection
      document.getElementById("left-nav-tree").classList.remove("is-open");
    }
  }

  // Handle tab button clicks
  const tabButton = target.closest(".tab-button");
  if (tabButton) {
    e.preventDefault();
    const tabsWrapper = tabButton.closest(".tabs-wrapper");

    // Remove active class from all tabs and panes within this specific tab component
    tabsWrapper
      .querySelectorAll(".tab-button")
      .forEach((tab) => tab.classList.remove("active"));
    tabsWrapper
      .querySelectorAll(".tab-pane")
      .forEach((pane) => pane.classList.remove("active"));

    // Add active class to clicked tab and corresponding pane
    tabButton.classList.add("active");
    const targetId = tabButton.dataset.target;
    document.getElementById(targetId).classList.add("active");
  }
}

/**
 * Attaches click listeners to directory titles to toggle sub-menus.
 */
function attachAccordionListeners() {
  const directories = document.querySelectorAll(".nav-directory");
  directories.forEach((dir) => {
    dir.addEventListener("click", () => {
      dir.parentElement.classList.toggle("is-open");
    });
  });
}

/**
 * Attaches listeners for opening and closing the mobile navigation.
 */
function attachMobileNavListener() {
  const toggleButton = document.getElementById("mobile-nav-toggle");
  const closeButton = document.getElementById("close-mobile-nav"); // Get the new close button
  const navTree = document.getElementById("left-nav-tree");

  if (toggleButton && navTree) {
    // Hamburger icon now ONLY opens the nav
    toggleButton.addEventListener("click", () => {
      navTree.classList.add("is-open");
    });
  }

  if (closeButton && navTree) {
    // The new 'X' button ONLY closes the nav
    closeButton.addEventListener("click", () => {
      navTree.classList.remove("is-open");
    });
  }
}

/**
 * Updates the live clock in the header every second.
 */
function updateClock() {
  setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    if (liveClock) {
      liveClock.textContent = `[${timeString}]`;
    }
  }, 1000);
}

/**
 * Initializes all UI components and event listeners.
 */
export function initUI() {
  // A single, more efficient event listener on the body handles all clicks.
  document.body.addEventListener("click", handleNavClick);

  attachAccordionListeners();
  attachMobileNavListener();
  updateClock();

  // Initial content load
  loadContent("template-home");
  document.getElementById("home-link").classList.add("active");
}
