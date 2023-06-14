const projectTable = document.getElementById('project-table');
const listProjectsBtn = document.getElementById('list-projects-btn');

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

async function listProjects() {
  const projects = await
  window.archpro.fetch('/list-projects');
  const customers = await
  window.archpro.fetch('/list-users');
  const payments = await
  window.archpro.fetch('/list-payments');
  const summary = {};

  // Remove existing table rows
  const tbody = projectTable.querySelector('tbody');
  if (tbody) {
    tbody.remove();
  }

   // Create table headers dynamically
   const headers = ['Customer', 'Project', 'Price', 'Payments', 'Edit Project', 'Edit Price']; //Edit Project, Edit Price
   //adding for update
   const thead = projectTable.createTHead();
   const headerRow = thead.insertRow();
   
   headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  const tbodyNew = document.createElement('tbody');
  projectTable.appendChild(tbodyNew);
  // end adding for update

  projects.forEach(project => {
    const customer = customers.find(customer => customer.id === project.customer_id);
    const paymentsForProject = payments.filter(payment => payment.project_id === project.id);
    const totalPayments = paymentsForProject.reduce((sum, payment) => sum + payment.payment, 0);
    summary[project.id] = totalPayments;

    const row = tbodyNew.insertRow(-1); //modified for update
    const customerCell = row.insertCell(0);
    const projectCell = row.insertCell(1);
    const priceCell = row.insertCell(2);
    const paymentsCell = row.insertCell(3);

    const editProjectCell = row.insertCell(4); //added for update
    const editPriceCell = row.insertCell(5); //added for update

    customerCell.textContent = customer ? customer.name : '';
    projectCell.textContent = project.project;
    priceCell.textContent = project.price;
    paymentsCell.textContent = totalPayments;

    // added for edit project and price

    const editProjectButton = document.createElement('button');
    editProjectButton.textContent = 'Edit Project';
    editProjectButton.addEventListener('click', () => editProject(project.id));
    editProjectCell.appendChild(editProjectButton);

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
  window.archpro.fetch(`/update-projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authToken') // Include the authorization token
    },
    body: JSON.stringify(updatedProject)
  })
  .then((response) => {
    if (response && response.message) {
      alert(response.message);
      const closeTableButton = document.querySelector("#close-projects-btn");
      closeTableButton.dispatchEvent(new Event("click"));
    } else {
      throw new Error(`Failed to update project`);
    }
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
  window.archpro.fetch(`/update-projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authToken') // Include the authorization token
    },
    body: JSON.stringify(updatedProject)
  })
  .then((response) => {
    if (response && response.message) {
      alert(response.message);
      // You can perform additional actions if needed
      const closeTableButton = document.querySelector("#close-projects-btn");
      closeTableButton.dispatchEvent(new Event("click"));
    } else {
      throw new Error("Failed to update price");
    }
  })
  .catch(error => {
    console.error(error);
    alert('Error updating price.');
  });
}

// end added for edit project and price

