const listProjectsBtn = document.querySelector('#list-projects-btn');
const projectsTable = document.querySelector('#projects-table tbody');

listProjectsBtn.addEventListener('click', async () => {
	try {
		// Fetch the list of projects from the server
		const projectsResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-projects');
		const projects = await projectsResponse.json();

		// Fetch the list of customers from the server
		const customersResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users');
		const customers = await customersResponse.json();

		// Fetch the list of payments from the server
		const paymentsResponse = await fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-payments');
		const payments = await paymentsResponse.json();

		// Join the project data with the customer data
		const data = projects.map(project => {
			const customer = customers.find(c => c.id === project.customer_id);
			return {
				project: project.project,
				price: project.price,
				customer: customer ? customer.name : 'N/A',
				payments: []
			};
		});

		// Join the payment data with the project data
		payments.forEach(payment => {
			const project = data.find(p => p.project === payment.project);
			if (project) {
				project.payments.push(payment.amount);
			}
		});

		// Render the table rows
		const tableRows = data.map(row => {
			const paymentSum = row.payments.reduce((acc, payment) => acc + payment, 0);
			return `
				<tr>
					<td>${row.project}</td>
					<td>${row.price}</td>
					<td>${row.customer}</td>
					<td>${paymentSum}</td>
				</tr>
			`;
		}).join('');

		// Populate the table with the rows
		projectsTable.innerHTML = tableRows;
	} catch (error) {
		console.error(error);
	}
});
