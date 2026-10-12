// Mobile navigation, the optional dark theme, and appointment form validation.
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const currentYear = document.querySelector('#current-year');

if (currentYear) currentYear.textContent = String(new Date().getFullYear());

function closeMenu() {
  if (!menuToggle || !navMenu) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  navMenu.classList.remove('is-open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navMenu?.classList.toggle('is-open', open);
});

navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('brightside-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-mode');

function updateThemeLabel() {
  const dark = document.body.classList.contains('dark-mode');
  themeToggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle?.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('brightside-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateThemeLabel();
});

const bookingForm = document.querySelector('#booking-form');
const successMessage = document.querySelector('#form-success');
const requiredFields = [
  { id: 'full-name', errorId: 'name-error', message: 'Please enter your name.' },
  { id: 'phone', errorId: 'phone-error' },
  { id: 'preferred-date', errorId: 'date-error', message: 'Please choose a preferred date.' },
  { id: 'service', errorId: 'service-error', message: 'Please choose a service.' },
];

function validateField(field) {
  const input = document.getElementById(field.id);
  const error = document.getElementById(field.errorId);
  if (!input || !error) return true;
  let message = '';

  if (!input.value.trim()) {
    message = field.message || 'Please enter your phone number.';
  } else if (field.id === 'phone') {
    const digitCount = input.value.replace(/\D/g, '').length;
    if (digitCount < 7 || digitCount > 15) message = 'Enter a valid phone number (7–15 digits).';
  } else if (field.id === 'preferred-date') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(`${input.value}T00:00:00`);
    if (Number.isNaN(selected.getTime())) message = 'Please enter a valid date.';
    else if (selected < today) message = 'Please choose today or a future date.';
  }

  error.textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

requiredFields.forEach((field) => {
  const input = document.getElementById(field.id);
  input?.addEventListener('input', () => validateField(field));
  input?.addEventListener('change', () => validateField(field));
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.hidden = true;
  const valid = requiredFields.map(validateField).every(Boolean);
  if (!valid) {
    bookingForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const firstName = document.querySelector('#full-name').value.trim().split(/\s+/)[0];
  successMessage.textContent = `Thanks, ${firstName}! Your request is ready. This portfolio demo doesn’t send form data; please call (02) 8123 4567 to confirm a visit.`;
  successMessage.hidden = false;
  successMessage.focus();
  bookingForm.reset();
  requiredFields.forEach((field) => {
    document.getElementById(field.id)?.removeAttribute('aria-invalid');
    document.getElementById(field.errorId).textContent = '';
  });
});

const dateInput = document.querySelector('#preferred-date');
if (dateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
}
