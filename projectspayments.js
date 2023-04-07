const customerList = document.getElementById("customer-list");
const projectTable = document.getElementById("project-table");
const paymentTable = document.getElementById("payment-table");

// Clear project and payment tables
function clearTables() {
	projectTable.innerHTML = "<tr><th>Project Name</th></tr>";
	paymentTable.innerHTML = "<tr><th>Payment Date</th><th>Payment Amount</th></tr>";
}

// Populate customer dropdown list
fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
	.then(response => response.json())
	.then(data => {
		data.forEach(customer => {
			const option = document.createElement("option");
			option.text = customer.name;
			option.value = customer.id;
			customerList.add(option);
		});
	});

// Populate project table when customer is selected
customerList.addEventListener("change", () => {
	clearTables();
	const customerId = customerList.value;
	if (customerId) {
		fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
			.then(response => response.json())
			.then(data => {
				data.forEach(project => {
					const row = projectTable.insertRow(-1);
					const cell = row.insertCell(0);
					cell.innerHTML = project.project;
					cell.addEventListener("click", () => {
						// Clear payment table
						paymentTable.innerHTML = "<tr><th>Payment Date</th><th>Payment Amount</th></tr>";
						// Populate payment table with payments for selected project
						fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectpayments?project_id=${project.id}`)
							.then(response => response.json())
							.then(data => {
								data.forEach(payment => {
									const row = paymentTable.insertRow(-1);
									const dateCell = row.insertCell(0);
									const amountCell = row.insertCell(1);
									dateCell.innerHTML = payment.date;
									amountCell.innerHTML = payment.payment;
								});
							});
					});
				});
			});
	}
});
