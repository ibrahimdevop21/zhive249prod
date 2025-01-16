// Form submission handling
const form = document.querySelector('form');
if (!form) throw new Error('Form not found');

const submitBtn = form.querySelector('button[type="submit"]');
if (!submitBtn) throw new Error('Submit button not found');

const submitText = submitBtn.querySelector('.submit-text');
if (!submitText) throw new Error('Submit text not found');

const spinner = submitBtn.querySelector('.loading-spinner');
if (!spinner) throw new Error('Loading spinner not found');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  submitText.classList.add('hidden');
  spinner.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      alert('Message sent successfully!');
      form.reset();
    } else {
      const data = await response.json();
      if (data.errors) {
        alert(data.errors.map((error) => error.message).join('\n'));
      } else {
        alert('There was a problem sending your message. Please try again.');
      }
    }
  } catch (error) {
    console.error('Form submission error:', error.message);
    alert('There was a network error. Please try again.');
  } finally {
    // Reset button state
    submitText.classList.remove('hidden');
    spinner.classList.add('hidden');
    submitBtn.disabled = false;
  }
});
