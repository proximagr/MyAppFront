const listProjectsBtn = document.getElementById('list-payments-btn');
const listProjectsTable = document.getElementById('list-payments-table');

listProjectsBtn.addEventListener('click', () => {
    const xhr1 = new XMLHttpRequest();
    xhr1.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-projects', true);
    xhr1.onload = function() {
        if (this.status === 200) {
            const projects = JSON.parse(this.responseText);

            const xhr2 = new XMLHttpRequest();
            xhr2.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-users', true);
            xhr2.onload = function() {
                if (this.status === 200) {
                    const users = JSON.parse(this.responseText);

                    const xhr3 = new XMLHttpRequest();
                    xhr3.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-payments', true);
                    xhr3.onload = function() {
                        if (this.status === 200) {
                            const payments = JSON.parse(this.responseText);

                            let tableHTML = '<table><thead><tr><th>Project</th><th>Price</th><th>Customer</th><th>Payments</th></tr></thead><tbody>';

							console.log('projects length:', projects.length);
							console.log('payments length:', payments.length);
							console.log('payments before join:', payments);

                            projects.forEach(project => {
                                const customer = users.find(user => user.id === project.customer_id);
                                const projectPayments = payments.filter(payment => payment.project_id === project.id);
                                const paymentSum = projectPayments.reduce((total, payment) => total + payment.amount, 0);
                                tableHTML += `<tr><td>${project.project}</td><td>${project.price}</td><td>${customer.name}</td><td>${paymentSum}</td></tr>`;
                            });
							
							console.log('payments after join:', payments);
							console.log('ayments.payment after join:', payments.payment);

                            tableHTML += '</tbody></table>';
                            listProjectsTable.innerHTML = tableHTML;
                        }
                    };
                    xhr3.send();
                }
            };
            xhr2.send();
        }
    };
    xhr1.send();
});
