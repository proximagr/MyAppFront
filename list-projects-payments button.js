const projectTable = document.getElementById('project-table');
const listProjectsBtn = document.getElementById('list-projects-btn');

async function listProjects() {
  const response = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-projects');
  const projects = await response.json();

  const customerResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users');
  const customers = await customerResponse.json();

  const paymentsResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-payments');
  const payments = await paymentsResponse.json();

  const summary = {};

   // Create table headers dynamically
   const headers = ['Customer', 'Project', 'Price', 'Payments', 'Edit']; // EDIT cell
   const headerRow = projectTable.insertRow(0);
   headers.forEach(header => {
     const th = document.createElement('th');
     th.textContent = header;
     headerRow.appendChild(th);
   });

  projects.forEach(project => {
    const customer = customers.find(customer => customer.id === project.customer_id);
    const paymentsForProject = payments.filter(payment => payment.project_id === project.id);
    const totalPayments = paymentsForProject.reduce((sum, payment) => sum + payment.payment, 0);
    summary[project.id] = totalPayments;

    const row = projectTable.insertRow(-1);
    const customerCell = row.insertCell(0);
    const projectCell = row.insertCell(1);
    const priceCell = row.insertCell(2);
    const paymentsCell = row.insertCell(3);
    const editCell = row.insertCell(4); // Add a new cell for the edit button

    projectCell.textContent = project.project;
    priceCell.textContent = project.price;
    customerCell.textContent = customer ? customer.name : '';
    paymentsCell.textContent = totalPayments;
    const editButton = document.createElement("button"); // Create the edit button
    editButton.textContent = "Edit"; //edit button
    editButton.addEventListener("click", () => { // Add a click event listener to the edit button
    showEditPaymentForm(payment); // Call a function to display the edit payment form
  }); // for the edit listener
  editCell.appendChild(editButton); // Add the edit button to the edit cell
  });
  console.log(summary);
}

listProjectsBtn.addEventListener('click', listProjects);

// close projects-table
document.addEventListener("DOMContentLoaded", function () {
  const closeTableButton = document.querySelector("#close-projects-btn");

  closeTableButton.addEventListener("click", function () {
    const table = document.querySelector("#project-table");
    table.innerHTML = "";
  });
});
