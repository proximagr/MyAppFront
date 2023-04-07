// Define variables for elements
const customerDropdown = document.getElementById("customer-dropdown");
const projectTable = document.getElementById("project-table");
const paymentTable = document.getElementById("payment-table");

// Define function to populate the customer dropdown
function populateCustomerDropdown() {
  // Make a request to the /list-users endpoint to get a list of customers
  fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
    .then((response) => response.json())
    .then((data) => {
      // Loop through the list of customers and add each one to the dropdown
      data.forEach((customer) => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.text = customer.name;
        customerDropdown.add(option);
      });
    })
    .catch((error) => console.error(error));
}

// Define function to populate the project table for a given customer
function populateProjectTable(customerId) {
  // Make a request to the /list-customerprojects endpoint to get a list of projects for the selected customer
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear the existing project table
      projectTable.innerHTML = "";
      // Create a new row for each project and add it to the table
      data.forEach((project) => {
        const row = projectTable.insertRow();
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        cell1.innerHTML = project.id;
        cell2.innerHTML = project.name;
        // Add a click event listener to the row to populate the payment table for the selected project
        row.addEventListener("click", () => populatePaymentTable(project.id));
      });
    })
    .catch((error) => console.error(error));
}

// Define function to populate the payment table for a given project
function populatePaymentTable(projectId) {
  // Make a request to the /list-payments endpoint to get a list of payments for the selected project
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-payments?project_id=${projectId}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear the existing payment table
      paymentTable.innerHTML = "";
      // Create a new row for each payment and add it to the table
      data.forEach((payment) => {
        const row = paymentTable.insertRow();
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3 = row.insertCell();
        cell1.innerHTML = payment.id;
        cell2.innerHTML = payment.date;
        cell3.innerHTML = payment.amount;
      });
    })
    .catch((error) => console.error(error));
}

// Add a change event listener to the customer dropdown to populate the project table for the selected customer
customerDropdown.addEventListener("change", () => {
  // Get the selected customer ID
  const selectedCustomerId = customerDropdown.value;
  // Clear the project and payment tables
  projectTable.innerHTML = "";
  paymentTable.innerHTML = "";
  // Populate the project table for the selected customer
  populateProjectTable(selectedCustomerId);
});

// Call the function to populate the customer dropdown on page load
populateCustomerDropdown();
