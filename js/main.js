// js/main.js

import { initUI } from './ui.js';

// --- BOOT SEQUENCE ---
const BOOT_MESSAGES = [
  "CONNECTING TO PORTFOLIO_OS V1.0...",
  "ESTABLISHING SECURE CONNECTION...",
  "ACCESSING_USER_PROFILE: [ALLAN COLLETT]...",
  "LOADING_UX_DESIGN_MODULES...",
  "LOADING_TECH_LABS...",
  "LOADING_ABOUT_ME_FILE...",
  "SYSTEM_READY.",
  "WELCOME."
];

const bootLog = document.getElementById('boot-log');
const bootScreen = document.getElementById('boot-screen');
const dashboard = document.getElementById('dashboard');

let messageIndex = 0;

function runBootSequence() {
  if (messageIndex < BOOT_MESSAGES.length) {
    bootLog.innerHTML += BOOT_MESSAGES[messageIndex] + '\n';
    messageIndex++;
  } else {
    clearInterval(bootInterval);
    // Fade out boot screen and fade in dashboard
    bootScreen.style.opacity = '0';
    setTimeout(() => {
      bootScreen.classList.add('hidden');
      dashboard.classList.remove('hidden');
      dashboard.style.opacity = '1';
      // Initialize the UI interactions and load the home page
      initUI();
    }, 500); // Wait for fade out to complete
  }
}

// Skip boot sequence on keypress
document.addEventListener('keydown', () => {
    if (!dashboard.classList.contains('hidden')) return;
    messageIndex = BOOT_MESSAGES.length;
    runBootSequence();
});

const bootInterval = setInterval(runBootSequence, 300);