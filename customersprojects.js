fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
  .then(response => response.json())
  .then(data => {
    // `data` variable now contains the response from the server
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
