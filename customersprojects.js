const customerSelect = document.getElementById('customer-select');

fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
  .then(response => response.json())
  .then(data => {
    data.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = customer.name;
      customerSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error(error);
  });
