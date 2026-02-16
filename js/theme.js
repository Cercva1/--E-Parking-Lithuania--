// theme.js - apply & persist theme
function applyTheme(themeClass){
  // themeClass example: 'theme-eco', 'theme-black', 'theme-purple', 'theme-blue'
  document.documentElement.classList.remove('theme-eco','theme-black','theme-purple','theme-blue');
  document.documentElement.classList.add(themeClass);
  localStorage.setItem('siteTheme', themeClass);
}

// initialize on load
(function initTheme(){
  const saved = localStorage.getItem('siteTheme') || 'theme-eco';
  document.documentElement.classList.add(saved);
})();
