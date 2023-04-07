const customerSelect = document.getElementById('customer-select');
const projectSelect = document.getElementById('project-select');

fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
  .then(response => response.json())
  .then(data => {
    data.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = customer.name;
      customerSelect.appendChild(option);
      //display the option values to the console
        console.log(option.value);
    });
  })
  .catch(error => {
    console.error(error);
  });

//get the data from the projects table using the http://arch.francecentral.cloudapp.azure.com:43704/list-projects API
fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-projects')
    .then(response => response.json())
    .then(data => {
        data.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
            //display the option values to the console
            console.log(option.value);
        });
    })