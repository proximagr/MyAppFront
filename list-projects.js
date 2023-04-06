const xhrProjects = new XMLHttpRequest();
xhrProjects.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-projects', true);
xhrProjects.onload = function () {
  if (this.status === 200) {
    const projects = JSON.parse(this.responseText);
    const xhrCustomers = new XMLHttpRequest();
    xhrCustomers.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-users', true);
    xhrCustomers.onload = function () {
      if (this.status === 200) {
        const customers = JSON.parse(this.responseText);
        const xhrPayments = new XMLHttpRequest();
        xhrPayments.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-payments', true);
        xhrPayments.onload = function () {
          if (this.status === 200) {
            const payments = JSON.parse(this.responseText);
            const projectsTable = document.getElementById('projectsTable');
            projectsTable.innerHTML = `
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Price</th>
                  <th>Customer</th>
                  <th>Payments</th>
                </tr>
              </thead>
              <tbody>
                ${projects.map(project => {
                  const customer = customers.find(c => c.id === project.customer_id);
                  const projectPayments = payments.filter(p => p.project_id === project.id);
                  const paymentSum = projectPayments.reduce((acc, curr) => acc + curr.amount, 0);
                  return `
                    <tr>
                      <td>${project.project}</td>
                      <td>${project.price}</td>
                      <td>${customer ? customer.name : ''}</td>
                      <td>${paymentSum}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            `;
          }
        };
        xhrPayments.send();
      }
    };
    xhrCustomers.send();
  }
};
xhrProjects.send();
