const customerSelect = document.getElementById('customer-select');
const projectSelect = document.getElementById('project-select');

customerSelect.addEventListener('change', () => {
  const customerId = customerSelect.value;
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects?customer_id=${customerId}`)
    .then(response => response.json())
    .then(data => {
      projectSelect.innerHTML = '';
      data.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error(error);
    });
});
