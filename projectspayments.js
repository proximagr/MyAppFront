const customersDropdown = document.querySelector('#customers');
const projectsDropdown = document.querySelector('#projects');
const paymentsTable = document.querySelector('#payments');

// Clear any existing options from the customers dropdown
function clearCustomersDropdown() {
    customersDropdown.innerHTML = '';
    projectsDropdown.innerHTML = '<option value="" selected disabled>Please select a customer</option>';
    paymentsTable.innerHTML = '';
}

// Populate the customers dropdown
function populateCustomersDropdown() {
    clearCustomersDropdown();
    fetch('http://arch.francecentral.cloudapp.azure.com:43704/list-users')
        .then(response => response.json())
        .then(data => {
            const customers = data.data;
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = customer.name;
                customersDropdown.appendChild(option);
            });
        });
}

// Populate the projects dropdown based on the selected customer
function populateProjectsDropdown(customerId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
        .then(response => response.json())
        .then(data => {
            const projects = data.data;
            projectsDropdown.innerHTML = '<option value="" selected disabled>Please select a project</option>';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.project;
                projectsDropdown.appendChild(option);
            });
        });
}

// Populate the payments table based on the selected project
function populatePaymentsTable(projectId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            const payments = data.data;
            if (payments.length > 0) {
                let tableHtml = '<table><tr><th>Date</th><th>Amount</th></tr>';
                payments.forEach(payment => {
                    tableHtml += `<tr><td>${payment.date}</td><td>${payment.payment}</td></tr>`;
                });
                tableHtml += '</table>';
                paymentsTable.innerHTML = tableHtml;
            } else {
                paymentsTable.innerHTML = '<p>No payments found for this project</p>';
            }
        });
}

// Event listeners
customersDropdown.addEventListener('change', () => {
    const customerId = customersDropdown.value;
    if (customerId) {
        populateProjectsDropdown(customerId);
    } else {
        clearCustomersDropdown();
    }
});

projectsDropdown.addEventListener('change', () => {
    const projectId = projectsDropdown.value;
    if (projectId) {
        populatePaymentsTable(projectId);
    } else {
        paymentsTable.innerHTML = '';
    }
});

// Initial population of customers dropdown
populateCustomersDropdown();
