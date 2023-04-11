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

    // Create a new paymentform object for the current project
    const paymentform = { 
      id: project.id,
      date: paymentsForProject[0] ? paymentsForProject[0].date : '',
      payment: paymentsForProject[0] ? paymentsForProject[0].payment : ''
    };
    // END Create a new paymentform object for the current project

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
     const form = document.createElement("form"); // Create the form element
     showEditPaymentForm(paymentform, form); // Call a function to display the edit payment form
     document.body.appendChild(form); // Add the form to the page
    }); // for the edit listener
  editCell.appendChild(editButton); // Add the edit button to the edit cell
  });
  console.log(summary);
}

// showEditPaymentForm function
function showEditPaymentForm(paymentform, form) {
  const form = document.createElement("form");
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Date:";
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = paymentform.date;
  const amountLabel = document.createElement("label");
  amountLabel.textContent = "Amount:";
  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.value = paymentform.payment;
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const newDate = dateInput.value;
    const newAmount = amountInput.value;
    // Update the payment in the database using a fetch request
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-payment?id=${paymentform.id}&date=${newDate}&payment=${newAmount}`)
      .then(response => response.json())
      .then(result => {
        // Update the payment row in the table with the new values
        paymentform.date = newDate;
        paymentform.payment = newAmount;
        const row = paymentTable.rows[paymentTable.rows.length - payments.length - 1]; // Find the row that corresponds to the edited payment
        row.cells[0].textContent = newDate; // Update the date cell
        row.cells[1].textContent = newAmount; // Update the amount cell
        form.remove(); // Remove the form from the page
      })
      .catch(error => console.error(error));
  });
  form.appendChild(dateLabel);
  form.appendChild(dateInput);
  form.appendChild(amountLabel);
  form.appendChild(amountInput);
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