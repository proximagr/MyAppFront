const customerSelect = document.getElementById("customer-select");
const projectsTableBody = document.getElementById("projects-table-body");
const paymentsTableBody = document.getElementById("payments-table-body");

// Populate customer dropdown
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

// Populate projects table on customer selection
customerSelect.addEventListener("change", (event) => {
  const customerId = event.target.value;
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
    .then((response) => response.json())
    .then((data) => {
      projectsTableBody.innerHTML = "";
      data.forEach((project) => {
        const row = projectsTableBody.insertRow();
        row.addEventListener("click", () => {
          fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-payments?project_id=${project.id}`)
            .then((response) => response.json())
            .then((data) => {
              paymentsTableBody.innerHTML = "";
              data.forEach((payment) => {
                const paymentRow = paymentsTableBody.insertRow();
                const paymentIdCell = paymentRow.insertCell();
                paymentIdCell.innerHTML = payment.id;
                const projectIdCell = paymentRow.insertCell();
                projectIdCell.innerHTML = payment.project_id;
                const paymentCell = paymentRow.insertCell();
                paymentCell.innerHTML = payment.payment;
              });
            })
            .catch((error) => console.error(error));
        });
        const projectIdCell = row.insertCell();
        projectIdCell.innerHTML = project.id;
        const projectNameCell = row.insertCell();
        projectNameCell.innerHTML = project.project;
        const projectPaymentsCell = row.insertCell();
        projectPaymentsCell.innerHTML = "<button>View Payments</button>";
      });
    })
    .catch((error) => console.error(error));
});
