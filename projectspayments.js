const customersSelect = document.getElementById('customers');
const projectsContainer = document.getElementById('projects-container');
const paymentsContainer = document.getElementById('payments-container');

// Populate customers dropdown
fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
  .then(response => response.json())
  .then(data => {
    data.forEach(customer => {
      const option = document.createElement('option');
      option.text = customer.name;
      option.value = customer.id;
      customersSelect.add(option);
    });
  })
  .catch(error => console.error(error));

// Get projects for selected customer
function getProjects() {
  // Clear projects and payments containers
  projectsContainer.innerHTML = '';
  paymentsContainer.innerHTML = '';

  const customerId = customersSelect.value;
  if (!customerId) {
    return;
  }

  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        projectsContainer.innerHTML = 'No projects found.';
      } else {
        const table = document.createElement('table');
        const header = table.createTHead();
        const row = header.insertRow();
        const nameCell = row.insertCell();
        nameCell.innerHTML = '<b>Project Name</b>';

        data.forEach(project => {
          const row = table.insertRow();
          const nameCell = row.insertCell();
          nameCell.innerHTML = project.project;
          nameCell.addEventListener('click', () => getPayments(project.id));
          nameCell.style.cursor = 'pointer';
        });

        projectsContainer.appendChild(table);
      }
    })
    .catch(error => console.error(error));
}

// Get payments for selected project
function getPayments(projectId) {
  paymentsContainer.innerHTML = '';

  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${projectId}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        paymentsContainer.innerHTML = 'No payments found.';
      } else {
        const table = document.createElement('table');
        const header = table.createTHead();
        const row = header.insertRow();
        const amountCell = row.insertCell();
        amountCell.innerHTML = '<b>Payment Amount</b>';
        const dateCell = row.insertCell();
        dateCell.innerHTML = '<b>Date</b>';

        data.forEach(payment => {
          const row = table.insertRow();
          const amountCell = row.insertCell();
          amountCell.innerHTML = payment.payment;
          const dateCell = row.insertCell();
          dateCell.innerHTML = payment.date;
        });

        paymentsContainer.appendChild(table);
      }
    })
    .catch(error => console.error(error));
}
