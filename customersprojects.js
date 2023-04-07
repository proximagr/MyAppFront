const cprojectTable = document.getElementById('customer-project-table');
const listCProjectsBtn = document.getElementById('list-customers-projects-btn');

async function listProjects() {
  const response = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-projects');
  const projects = await response.json();

  const customerResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users');
  const customers = await customerResponse.json();

  const paymentsResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-payments');
  const payments = await paymentsResponse.json();

  const summary = {};

  projects.forEach(project => {
    const customer = customers.find(customer => customer.id === project.customer_id);
    const paymentsForProject = payments.filter(payment => payment.project_id === project.id);
    const totalPayments = paymentsForProject.reduce((sum, payment) => sum + payment.payment, 0);
    summary[project.id] = totalPayments;

    const row = cprojectTable.insertRow(-1);
    const projectCell = row.insertCell(0);
    const priceCell = row.insertCell(1);
    const customerCell = row.insertCell(2);
    const paymentsCell = row.insertCell(3);

    projectCell.textContent = project.project;
    priceCell.textContent = project.price;
    customerCell.textContent = customer ? customer.name : '';
    paymentsCell.textContent = totalPayments;
  });
  
  console.log(summary);
}

listCProjectsBtn.addEventListener('click', listProjects);