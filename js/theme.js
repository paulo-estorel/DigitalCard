(function () {
  'use strict';

  const STORAGE_KEY = 'sbc_theme';
  const choices = ['system', 'light', 'dark'];
  const root = document.documentElement;
  let selectedTheme = 'system';

  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (choices.includes(storedTheme)) selectedTheme = storedTheme;
  } catch (error) { /* storage unavailable */ }
  root.dataset.theme = selectedTheme;

  const lightPreference = window.matchMedia('(prefers-color-scheme: light)');

  function updateThemeColor() {
    const effectiveTheme = selectedTheme === 'system'
      ? (lightPreference.matches ? 'light' : 'dark')
      : selectedTheme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', effectiveTheme === 'light' ? '#F3F6F8' : '#07080A');
  }

  function syncButtons() {
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === selectedTheme));
    });
  }

  function selectTheme(theme) {
    if (!choices.includes(theme)) return;
    selectedTheme = theme;
    root.dataset.theme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (error) { /* storage unavailable */ }
    syncButtons();
    updateThemeColor();
  }

  function init() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-theme-choice]');
      if (button) selectTheme(button.dataset.themeChoice);
    });
    syncButtons();
    updateThemeColor();
    lightPreference.addEventListener('change', updateThemeColor);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();