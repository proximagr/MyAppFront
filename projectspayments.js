// Fetch customers and populate dropdown menu
fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
	.then(response => response.json())
	.then(data => {
		const customerSelect = document.getElementById('customer-select');
		data.forEach(customer => {
			const option = document.createElement('option');
			option.text = customer.name;
			option.value = customer.id;
			customerSelect.add(option);
		});
	});

// Clear projects and payments tables
function clearTables() {
	const projectsTableBody = document.querySelector('#projects-table tbody');
	projectsTableBody.innerHTML = '';
	const paymentsTableBody = document.querySelector('#payments-table tbody');
	paymentsTableBody.innerHTML = '';
}

// Populate projects table with projects for selected customer
function populateProjectsTable(customerId) {
	fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
		.then(response => response.json())
		.then(data => {
			const projectsTableBody = document.querySelector('#projects-table tbody');
			projectsTableBody.innerHTML = '';
			data.forEach(project => {
				const row = projectsTableBody.insertRow();
				const cell = row.insertCell();
				cell.innerHTML = project.name;
				row.addEventListener('click', () => populatePaymentsTable(project.id));
			});
		});
}

// Populate payments table with payments for selected project
function populatePaymentsTable(projectId) {
	fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${projectId}`)
		.then(response => response.json())
		.then(data => {
			const paymentsTableBody = document.querySelector('#payments-table tbody');
			paymentsTableBody.innerHTML = '';
			data.forEach(payment => {
				const row = paymentsTableBody.insertRow();
				const dateCell = row.insertCell();
				dateCell.innerHTML = payment.date;
				const amountCell = row.insertCell();
				amountCell.innerHTML = payment.amount;
				const descriptionCell = row.insertCell();
				descriptionCell.innerHTML = payment.description;
			});
		});
}

// Event listener for customer dropdown menu
const customerSelect = document.getElementById('customer-select');
customerSelect.addEventListener('change', () => {
	clearTables();
	const customerId = customerSelect.value;
	if (customerId) {
		populateProjectsTable(customerId);
	}
});
