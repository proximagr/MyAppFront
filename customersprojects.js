const projectTable = document.getElementById('customer-project-table');
const customerSelect = document.getElementById('customer-select');

async function init() {
  const customerResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users');
  const customers = await customerResponse.json();

  customers.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = customer.name;
    customerSelect.appendChild(option);
  });

  customerSelect.addEventListener('change', () => {
    const customerId = customerSelect.value;

    Promise.all([
      fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-projects').then(response => response.json()),
      fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-payments').then(response => response.json())
    ])
      .then(([projects, payments]) => {
        const summary = {};

        projectTable.querySelector('tbody').innerHTML = '';

        projects.filter(project => project.customer_id === customerId).forEach(project => {
          const paymentsForProject = payments.filter(payment => payment.project_id === project.id);
          const totalPayments = paymentsForProject.reduce((sum, payment) => sum + payment.payment, 0);
          summary[project.id] = totalPayments;

          const row = projectTable.insertRow(-1);
          const projectCell = row.insertCell(0);
          const priceCell = row.insertCell(1);
          const paymentsCell = row.insertCell(2);

          projectCell.textContent = project.project;
          priceCell.textContent = project.price;
          paymentsCell.textContent = totalPayments;
        });

        console.log(summary);
      })
      .catch(error => {
        console.error('Failed to fetch projects and payments:', error);
      });
  });
}

init();
