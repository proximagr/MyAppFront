// Retrieve the customer dropdown and project table
const customerDropdown = document.getElementById("customer-dropdown");
const projectTable = document.getElementById("project-table");

// Load the list of customers
fetch("/list-users")
  .then(response => response.json())
  .then(data => {
    // Populate the customer dropdown
    data.forEach(customer => {
      const option = document.createElement("option");
      option.text = customer.name;
      option.value = customer.id;
      customerDropdown.add(option);
    });
  });

// When the user selects a customer, show their projects
customerDropdown.addEventListener("change", () => {
  const customerId = customerDropdown.value;

  // Remove any existing rows in the project table
  while (projectTable.rows.length > 1) {
    projectTable.deleteRow(-1);
  }

  // Load the projects for the selected customer
  fetch(`/list-projects?customerId=${customerId}`)
    .then(response => response.json())
    .then(data => {
      // Populate the project table
      data.forEach(project => {
        if (project.customer_id === parseInt(customerId)) {
          const row = projectTable.insertRow(-1);
          const nameCell = row.insertCell(0);
          const priceCell = row.insertCell(1);
          nameCell.textContent = project.name;
          priceCell.textContent = project.price;
        }
      });
    });
});
