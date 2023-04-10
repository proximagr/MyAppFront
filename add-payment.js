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

// Add a new payment when the add-payment-button button is clicked
document.getElementById("add-payment-button").addEventListener("click", event => {
    event.preventDefault();

    const projectId = projectSelect.value;
    const amount = paymentAmount.value;
    const date = paymentDate.value;

    if (!projectId || !amount || !date) {
        alert("Please select a project and enter payment amount and date.");
        return;
    }

    fetch("http://arch.francecentral.cloudapp.azure.com:43704/add-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            project_id: projectId,
            payment: amount,
            date: date
        })
    })
        .then(response => response.json())
        .then(payment => {
            const row = paymentTable.insertRow();
            row.insertCell().textContent = payment.project;
            row.insertCell().textContent = payment.amount;
            row.insertCell().textContent = payment.date;
            paymentTotal.textContent = parseFloat(paymentTotal.textContent) + parseFloat(payment.amount);
            paymentAmount.value = "";
            paymentDate.value = "";
        })
        .catch(error => console.error(error));
});