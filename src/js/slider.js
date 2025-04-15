document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.switch-input');
  const body = document.querySelector('body');

  if (!slider || !body) {
    console.error('Не знайдено body або .switch-input');
    return;
  }

  function applyTheme(isDark) {
    body.classList.toggle('dark-theme', isDark);
    body.classList.toggle('light-theme', !isDark);
    slider.checked = isDark;
  }

  const savedThemeIsDark = localStorage.getItem('body-style') === 'true';
  applyTheme(savedThemeIsDark);

  function handleThemeChange() {
    const isDark = slider.checked;
    applyTheme(isDark);
    localStorage.setItem('body-style', String(isDark));
  }

  slider.addEventListener('change', handleThemeChange);
});
