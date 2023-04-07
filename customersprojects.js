const customerSelect = document.getElementById("customer-select");
const projectTable = document.getElementById("project-table");

customerSelect.addEventListener("change", () => {
  const customerId = customerSelect.value;
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects/${customerId}`)
    .then((response) => response.json())
    .then((data) => {
      projectTable.innerHTML = `
        <tr>
          <th>Project</th>
          <th>Price</th>
        </tr>
      `;
      data.forEach((project) => {
        const row = document.createElement("tr");
        const projectCell = document.createElement("td");
        const priceCell = document.createElement("td");
        projectCell.textContent = project.project;
        priceCell.textContent = project.price;
        row.appendChild(projectCell);
        row.appendChild(priceCell);
        projectTable.appendChild(row);
      });
    })
    .catch((error) => console.error(error));
});
