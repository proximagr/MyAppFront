const customerSelect = document.getElementById("customer-select");
const projectSelect = document.getElementById("project-select");
const paymentTable = document.getElementById("payment-table").getElementsByTagName("tbody")[0];
const paymentTotal = document.getElementById("payment-total")
const projectPriceEl = document.getElementById("project-price")

// Populate the customer dropdown
fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
	.then(response => response.json())
	.then(customers => {
		for (let customer of customers) {
			const option = document.createElement("option");
			option.value = customer.id;
			option.textContent = customer.name;
			customerSelect.appendChild(option);
		}
	})
	.catch(error => console.error(error));

// Clear project and payment tables and populate the project dropdown when a customer is selected
customerSelect.addEventListener("change", event => {
	const customerId = event.target.value;
	projectSelect.innerHTML = "<option value=''>Select a project</option>";
	paymentTable.innerHTML = "";
	if (customerId) {
		fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
			.then(response => response.json())
			.then(projects => {
				for (let project of projects) {
					const option = document.createElement("option");
					option.value = project.id;
					option.textContent = project.project + " ($" + project.price + ")";
					projectSelect.appendChild(option);
				}
			})
			.catch(error => console.error(error));
	}
});

// Populate the payment table and project price when a project is selected
projectSelect.addEventListener("change", event => {
  const projectId = event.target.value;
  paymentTable.innerHTML = "";
  paymentTotal.textContent = "";
  if (projectId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${projectId}`)
      .then(response => response.json())
      .then(payments => {
        let totalPayment = payments.reduce((sum, payment) => sum + payment.payment, 0);
        for (let payment of payments) {
          const row = paymentTable.insertRow();
          const dateCell = row.insertCell();
          const amountCell = row.insertCell();
          dateCell.textContent = payment.date;
          amountCell.textContent = payment.payment;
        }
        paymentTotal.textContent = `Total Payment: ${totalPayment}`;

		
        // Second fetch call
        fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects`)
          .then(response => response.json())
          .then(projects => {
            const project = projects.find(project => project.id === projectId);
            const projectPrice = project.price;
            projectPriceEl.textContent = `Project: ${projectPrice}`;
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
});
