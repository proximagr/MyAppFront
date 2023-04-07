const customerSelect = document.getElementById("customer-select");
const projectTable = document.getElementById("project-table");

fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.text = customer.name;
      customerSelect.add(option);
    });
  })
  .catch((error) => console.error(error));

customerSelect.addEventListener("change", () => {
  const customerId = customerSelect.value;
  fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-projects")
    .then((response) => response.json())
    .then((data) => {
      const customerProjects = data.filter(
        (project) => project.customer_id === customerId
      );
      let tableHtml = `
        <tr>
          <th>Project</th>
          <th>Price</th>
        </tr>
      `;
      customerProjects.forEach((project) => {
        tableHtml += `
          <tr>
            <td>${project.project}</td>
            <td>${project.price}</td>
          </tr>
        `;
      });
      projectTable.innerHTML = tableHtml;
    })
    .catch((error) => console.error(error));
});
