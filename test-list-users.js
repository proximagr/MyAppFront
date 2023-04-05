fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // process the data here
  })
  .catch(error => {
    console.error('Error:', error);
  });
  