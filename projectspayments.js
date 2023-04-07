const customersSelect = document.getElementById("customers-select");
const projectsSelect = document.getElementById("projects-select");
const paymentsTable = document.getElementById("payments-table");

// Load customers and populate select element
fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
  .then(response => response.json())
  .then(customers => {
    customers.forEach(customer => {
      const option = document.createElement("option");
      option.value = customer.customer_id;
      option.text = customer.name;
      customersSelect.add(option);
    });
  })
  .catch(error => console.error(error));

// When customer select element changes, load projects and populate select element
customersSelect.addEventListener("change", event => {
  const selectedCustomerId = event.target.value;
  
  // Clear projects select element and hide payments table
  projectsSelect.innerHTML = '<option value="">-- Select a project --</option>';
  projectsSelect.disabled = true;
  paymentsTable.style.display = "none";
  
  if (selectedCustomerId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704list-customerprojects?customer_id=${selectedCustomerId}`)
      .then(response => response.json())
      .then(projects => {
        projects.forEach(project => {
          const option = document.createElement("option");
          option.value = project.project_id;
          option.text = project.project;
          projectsSelect.add(option);
        });
        projectsSelect.disabled = false;
      })
      .catch(error => console.error(error));
  }
});

// When project select element changes, load payments and populate table
projectsSelect.addEventListener("change", event => {
  const selectedProjectId = event.target.value;
  
  // Clear payments table
  paymentsTable.style.display = "none";
  paymentsTable.tBodies[0].innerHTML = '';
  
  if (selectedProjectId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${selectedProjectId}`)
      .then(response => response.json())
      .then(payments => {
        payments.forEach(payment => {
          const row = paymentsTable.tBodies[0].insertRow(-1);
          row.insertCell(0).textContent = payment.payment_id;
          row.insertCell(1).textContent = payment.payment;
          row.insertCell(2).textContent = payment.date;
        });
        paymentsTable.style.display = "block";
      })
      .catch(error => console.error(error));
  }
});
