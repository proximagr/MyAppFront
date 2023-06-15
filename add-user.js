const form = document.getElementById('user-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;

  try {
    const response = await window.archpro.fetch('/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('authToken')
      },
      body: JSON.stringify({ name })
    });

    if (response.message) {
      alert(response.message);
    } else {
      alert('User added successfully!');
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert('Failed to add user. See console for details.');
  }
});
