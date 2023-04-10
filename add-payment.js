const customerSelect = document.getElementById("customer-select");
const projectSelect = document.getElementById("project-select");
const paymentTable = document.getElementById("payment-table").getElementsByTagName("tbody")[0];
const paymentTotal = document.getElementById("payment-total");
const paymentAmount = document.getElementById("payment-amount");
const paymentDate = document.getElementById("payment-date");

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

// when the add-payment-button button is clicked post to the payments table the project_id, payment and date fields.
const addPaymentButton = document.getElementById("add-payment-button");
addPaymentButton.addEventListener("click", event => {
    const projectId = projectSelect.value;
    const payment = paymentAmount.value;
    const date = paymentDate.value;
    if (projectId && payment && date) {
        fetch("http://arch.francecentral.cloudapp.azure.com:43704/add-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ project_id: projectId, payment, date })
        })
            .then(response => response.json())
            .then(payment => {
                const row = paymentTable.insertRow();
                row.insertCell().textContent = payment.project_id;
                row.insertCell().textContent = payment.payment;
                row.insertCell().textContent = payment.date;
                paymentTotal.textContent = parseFloat(paymentTotal.textContent) + parseFloat(payment.payment);
            })
            .catch(error => console.error(error));
    }
});