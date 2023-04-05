const tableBody = document.querySelector('#projects-table tbody');
document.getElementById('list-projects-btn').addEventListener('click', function() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-projects', true);
  xhr.onload = function() {
    if (this.status === 200) {
      const projects = JSON.parse(this.responseText);
      const xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'http://arch.francecentral.cloudapp.azure.com:43704/list-users', true);
      xhr2.onload = function() {
        if (this.status === 200) {
          const customers = JSON.parse(this.responseText);
          const data = projects.map(project => {
            const customer = customers.find(customer => customer.id === project.customer_id);
            return {
              project: project.project,
              price: project.price,
              customer_name: customer.name
            };
          });
          tableBody.innerHTML = ''; // Clear the table body
          data.forEach(item => {
            const row = tableBody.insertRow();
            const projectCell = row.insertCell();
            const priceCell = row.insertCell();
            const customerCell = row.insertCell();
            projectCell.textContent = item.project;
            priceCell.textContent = item.price;
            customerCell.textContent = item.customer_name;
          });
        }
      };
      xhr2.send();
    }
  };
  xhr.send();
});
