const form = document.querySelector('#signup-form');
const message = document.querySelector('#form-message');
const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

document.querySelector('#year').textContent = new Date().getFullYear();

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-role]').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('#role').value = link.dataset.role;
}));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.className = 'form-message';
  message.textContent = '';
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.innerHTML = 'Sending your details…';

  const formData = new FormData(form);
  const body = Object.fromEntries(formData.entries());
  body.consent = formData.get('consent') === 'on';

  try {
    const response = await fetch('/api/signups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'We could not send your details. Please try again.');
    form.reset();
    message.textContent = 'Thank you. Your details have been received and the OnePlace team will be in touch.';
  } catch (error) {
    message.classList.add('error');
    message.textContent = error.message === 'Failed to fetch'
      ? 'The signup service is not connected yet. Start the server and try again.'
      : error.message;
  } finally {
    button.disabled = false;
    button.innerHTML = 'Send my details <span>↗</span>';
  }
});
