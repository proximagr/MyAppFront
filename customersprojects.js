const customerSelect = document.getElementById("customer-select");
const projectsTable = document.getElementById("projects-table");

// function to retrieve projects for a specific customer
function retrieveProjects(customerId) {
  // clear the table first
  projectsTable.innerHTML = "";

  // make a request to retrieve projects for the selected customer
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects?customerId=${customerId}`)
    .then((response) => response.json())
    .then((data) => {
      // create a header row for the table
      const headerRow = document.createElement("tr");
      const projectHeader = document.createElement("th");
      projectHeader.textContent = "Project";
      const priceHeader = document.createElement("th");
      priceHeader.textContent = "Price";
      headerRow.appendChild(projectHeader);
      headerRow.appendChild(priceHeader);
      projectsTable.appendChild(headerRow);

      // create a row for each project and append it to the table
      data.forEach((project) => {
        const row = document.createElement("tr");
        const projectCell = document.createElement("td");
        projectCell.textContent = project.project;
        const priceCell = document.createElement("td");
        priceCell.textContent = project.price;
        row.appendChild(projectCell);
        row.appendChild(priceCell);
        projectsTable.appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

// function to retrieve customers and populate the dropdown
function retrieveCustomers() {
  fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((customer) => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.text = customer.name;
        customerSelect.add(option);
      });
    })
    .catch((error) => console.error(error));

  // add an event listener to the dropdown to retrieve projects for the selected customer
  customerSelect.addEventListener("change", (event) => {
    const customerId = event.target.value;
    retrieveProjects(customerId);
  });
}

// call the retrieveCustomers function on load
retrieveCustomers();

