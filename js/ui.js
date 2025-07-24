// js/ui.js

const mainContentArea = document.getElementById('main-content-area');
const liveClock = document.getElementById('live-clock');

/**
 * Loads content into the main area from an HTML template.
 * @param {string} templateId The ID of the <template> element.
 */
function loadContent(templateId) {
    const template = document.getElementById(templateId);
    if (template) {
        mainContentArea.classList.add('loading');

        setTimeout(() => {
            mainContentArea.innerHTML = '';
            const content = template.content.cloneNode(true);
            mainContentArea.appendChild(content);
            mainContentArea.classList.remove('loading');
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
    const navElement = target.closest('.nav-link, .back-link');
    if (navElement) {
        e.preventDefault();
        const templateId = navElement.dataset.template;
        if (templateId) {
            loadContent(templateId);
            if (navElement.closest('.left-nav-tree .nav-link')) {
                document.querySelectorAll('.left-nav-tree .nav-link').forEach(nav => nav.classList.remove('active'));
                navElement.classList.add('active');
                document.getElementById('left-nav-tree').classList.remove('is-open');
            }
        }
    }

    // NEW: Handle tab button clicks
    const tabButton = target.closest('.tab-button');
    if (tabButton) {
        e.preventDefault();
        const tabContainer = tabButton.closest('.tabs-container');
        const contentContainer = tabContainer.nextElementSibling;
        
        // Remove active class from all tabs and panes
        tabContainer.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
        contentContainer.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding pane
        tabButton.classList.add('active');
        const targetId = tabButton.dataset.target;
        document.getElementById(targetId).classList.add('active');
    }
}

/**
 * Attaches click listeners to directory titles to toggle sub-menus.
 */
function attachAccordionListeners() {
    const directories = document.querySelectorAll('.nav-directory');
    directories.forEach(dir => {
        dir.addEventListener('click', () => {
            dir.parentElement.classList.toggle('is-open');
        });
    });
}

/**
 * Attaches listeners for the mobile navigation toggle.
 */
function attachMobileNavListener() {
    const toggleButton = document.getElementById('mobile-nav-toggle');
    const navTree = document.getElementById('left-nav-tree');

    if (toggleButton && navTree) {
        toggleButton.addEventListener('click', () => {
            navTree.classList.toggle('is-open');
        });
    }
}

/**
 * Updates the live clock in the header every second.
 */
function updateClock() {
    setInterval(() => {
        const now = new Date();
        liveClock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
}

/**
 * Initializes all UI components and event listeners.
 */
export function initUI() {
    console.log("UI Initialized. Attaching listeners...");
    
    document.querySelector('.left-nav-tree').addEventListener('click', handleNavClick);
    mainContentArea.addEventListener('click', handleNavClick);

    attachAccordionListeners();
    attachMobileNavListener();
    updateClock();
    
    loadContent('template-home');
    document.getElementById('home-link').classList.add('active');
}