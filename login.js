document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch(window.archpro.getApiPath('/login'), {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem('authToken', token);
      window.location.href = '/index.html';
    } else {
      alert('Invalid username or password');
    }
  });
});
