function listPayments() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (this.status === 200) {
            const projects = JSON.parse(this.responseText);
            const tbody = document.querySelector('#payments-list tbody');
            tbody.innerHTML = '';

            projects.forEach(project => {
                // Create a new row for each project
                const row = document.createElement('tr');
                tbody.appendChild(row);

                // Add the project name and price to the row
                const nameCell = document.createElement('td');
                nameCell.textContent = project.project;
                row.appendChild(nameCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = project.price;
                row.appendChild(priceCell);

                // Fetch the customer name for the project
                const customerXHR = new XMLHttpRequest();
                customerXHR.open('GET', `http://arch.francecentral.cloudapp.azure.com:43704/list-users/${project.customer_id}`, true);
                customerXHR.onload = function() {
                    if (this.status === 200) {
                        const customer = JSON.parse(this.responseText);
                        // Add the customer name to the row
                        const customerCell = document.createElement('td');
                        customerCell.textContent = customer.name;
                        row.appendChild(customerCell);
                    }
                };
                customerXHR.send();

                // Fetch the payments for the project
                const paymentXHR = new XMLHttpRequest();
                paymentXHR.open('GET', `http://arch.francecentral.cloudapp.azure.com:43704/list-payments/${project.id}`, true);
                paymentXHR.onload = function() {
                    if (this.status === 200) {
                        const payments = JSON.parse(this.responseText);
                        let paymentSum = 0;
                        payments.forEach(payment => {
                            paymentSum += payment.amount;
                        });
                        // Add the payment sum to the row
                        const paymentCell = document.createElement('td');
                        paymentCell.textContent = paymentSum;
                        row.appendChild(paymentCell);
                    }
                };
                paymentXHR.send();
            });
        }
    };

    xhr.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-projects', true);
    xhr.send();
}
