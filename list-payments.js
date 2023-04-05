const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-projects', true);
xhr.onload = function() {
	if (this.status === 200) {
		const projects = JSON.parse(this.responseText);
		const tbody = document.querySelector('#projects-table tbody');
		projects.forEach(project => {
			// Create a new row for each project
			const row = document.createElement('tr');
			const projectCell = document.createElement('td');
			projectCell.textContent = project.project;
			const priceCell = document.createElement('td');
			priceCell.textContent = project.price;
			const customerCell = document.createElement('td');
			customerCell.textContent = project.customer_name;
			const paymentsCell = document.createElement('td');
			paymentsCell.textContent = project.payments_amount;
			row.appendChild(projectCell);
			row.appendChild(priceCell);
			row.appendChild(customerCell);
			row.appendChild(paymentsCell);
			tbody.appendChild(row);
		});
	}
};
xhr.send();
