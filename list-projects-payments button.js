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
   const headers = ['Customer', 'Project', 'Price', 'Payments', 'EditPrice']; // EDIT cell
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

    // Create a new editPriceform object for the current project
    const editpriceform = { 
      id: project.id,
      project: priceForProject[0] ? priceForProject[0].project : '',
      price: priceForProject[0] ? priceForProject[0].price : ''
    };
    // END Create a new priceform object for the current project

    const row = projectTable.insertRow(-1);
    const customerCell = row.insertCell(0);
    const projectCell = row.insertCell(1);
    const priceCell = row.insertCell(2);
    const paymentsCell = row.insertCell(3);
    const editpriceCell = row.insertCell(4); // Add a new cell for the edit button

    projectCell.textContent = project.project;
    priceCell.textContent = project.price;
    customerCell.textContent = customer ? customer.name : '';
    paymentsCell.textContent = totalPayments;
    const editpriceButton = document.createElement("button"); // Create the edit button
    editpriceButton.textContent = "Edit Price"; //edit button
    editpriceButton.addEventListener("click", () => { // Add a click event listener to the edit button
     const form = document.createElement("form"); // Create the form element
     showEditPriceForm(editpriceform, form); // Call a function to display the edit payment form
     document.body.appendChild(form); // Add the form to the page
    }); // for the edit listener
  editpriceCell.appendChild(editpriceButton); // Add the edit button to the edit cell
  });
  console.log(summary);
}

// showEditPriceForm function
function showEditPriceForm(editpriceform, form) {
  const projectLabel = document.createElement("label");
  projectLabel.textContent = "Project:";
  const projectInput = document.createElement("input");
  projectInput.type = "project";
  projectInput.value = editpriceform.project;
  const amountLabel = document.createElement("label");
  priceLabel.textContent = "Price:";
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.value = editpriceform.payment;
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const newProject = projectInput.value;
    const newPrice = priceInput.value;
    // Update the payment in the database using a fetch request
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-project?id=${editpriceform.id}&project=${newProject}&proce=${newPrice}`)
      .then(response => response.json())
      .then(result => {
        // Update the payment row in the table with the new values
        editpriceform.project = newProject;
        editpriceform.price = newPrice;
        const row = editpriceTable.rows[editpriceTable.rows.length - projects.length - 1]; // Find the row that corresponds to the edited payment
        row.cells[0].textContent = newProject; // Update the date cell
        row.cells[1].textContent = newPrice; // Update the amount cell
        form.remove(); // Remove the form from the page
      })
      .catch(error => console.error(error));
  });
  form.appendChild(projectLabel);
  form.appendChild(projectInput);
  form.appendChild(priceLabel);
  form.appendChild(priceInput);
  form.appendChild(saveButton);
  document.body.appendChild(form); // Add the form to the page
}

//end of showEditPaymentForm function

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