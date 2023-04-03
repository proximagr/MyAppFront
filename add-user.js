const form = document.getElementById('user-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const name = document.getElementById('name').value;

  try {
    const response = await fetch('http://localhost:3000/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add user: ${response.status} ${response.statusText}`);
    }

    alert('User added successfully!');
  } catch (error) {
    console.error(error);
    alert('Failed to add user. See console for details.');
  }
});
