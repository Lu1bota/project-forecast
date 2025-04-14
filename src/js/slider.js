document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.switch-input');
  const body = document.querySelector('body');

  if (!slider || !body) {
    console.error('Не знайдено body або .switch-input');
    return;
  }

  // Встановити початковий стан з localStorage
  if (localStorage.getItem('body-style') === 'true') {
    body.classList.add('change');

    slider.checked = true;
  } else {
    body.classList.remove('change'); // На випадок, якщо клас був раніше
    slider.checked = false;
  }

  // Обробник зміни стану перемикача
  function handleClick() {
    const isChanged = slider.checked;
    body.classList.toggle('change', isChanged);
    localStorage.setItem('body-style', String(isChanged)); // Зберегти як рядок 'true'/'false'
  }

  slider.addEventListener('change', handleClick);
});
