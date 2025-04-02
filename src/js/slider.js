const slider = document.querySelector('.switch-input');
const body = document.querySelector('body');

if (localStorage.getItem('body-style') === 'true') {
  body.classList.add('change');
  slider.checked = true;
}

function handleClick() {
  const isChanged = slider.checked;
  body.classList.toggle('change', isChanged);
  localStorage.setItem('body-style', isChanged);
}

slider.addEventListener('change', handleClick);
