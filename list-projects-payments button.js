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
   const headers = ['Customer', 'Project', 'Price', 'Payments'];
   const headerRow = projectTable.insertRow(0);
   headers.forEach(header => {
     const th = document.createElement('th');
     th.textContent = header;
     headerRow.appendChild(th);
      // added for edit project and price
      const editProjectTh = document.createElement('th');
      editProjectTh.textContent = 'Edit Project';
      headerRow.appendChild(editProjectTh);
      const editPriceTh = document.createElement('th');
      editPriceTh.textContent = 'Edit Price';
      headerRow.appendChild(editPriceTh);
      // end added for edit project and price
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

    projectCell.textContent = project.project;
    priceCell.textContent = project.price;
    customerCell.textContent = customer ? customer.name : '';
    paymentsCell.textContent = totalPayments;
    // added for edit project and price
    const editProjectCell = row.insertCell(4);
    const editProjectButton = document.createElement('button');
    editProjectButton.textContent = 'Edit Project';
    editProjectButton.addEventListener('click', () => editProject(project.id));
    editProjectCell.appendChild(editProjectButton);
    const editPriceCell = row.insertCell(5);
    const editPriceButton = document.createElement('button');
    editPriceButton.textContent = 'Edit Price';
    editPriceButton.addEventListener('click', () => editPrice(project.id));
    editPriceCell.appendChild(editPriceButton);
    // end added for edit project and price
  });
  console.log(summary);
}

// added for edit project and price
function editProject(projectId) {
  const newProjectName = prompt('Enter a new name for the project:');
  if (newProjectName === null) {
    return;
  }
  const updatedProject = { project: newProjectName };
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedProject)
  })
  .then(() => {
    alert('Project updated successfully!');
    listProjects();
  })
  .catch(error => {
    console.error(error);
    alert('Error updating project.');
  });
}

function editPrice(projectId) {
  const newPrice = prompt('Enter a new price for the project:');
  if (newPrice === null) {
    return;
  }
  const updatedProject = { price: newPrice };
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedProject)
  })
  .then(() => {
    alert('Price updated successfully!');
    listProjects();
  })
  .catch(error => {
    console.error(error);
    alert('Error updating price.');
  });
}

// end added for edit project and price

//button to list the projects
listProjectsBtn.addEventListener('click', listProjects);

// close projects-table
document.addEventListener("DOMContentLoaded", function () {
  const closeTableButton = document.querySelector("#close-projects-btn");

  closeTableButton.addEventListener("click", function () {
    const table = document.querySelector("#project-table");
    table.innerHTML = "";
  });
});