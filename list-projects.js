document.addEventListener("DOMContentLoaded", function () {
  const listprojectsButton = document.querySelector("#list-projects-btn");

  listprojectsButton.addEventListener("click", function () {
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-projects")
      .then((response) => response.json())
      .then((data) => {
        const table = document.querySelector("#projects-table");
        table.innerHTML = "";
        data.forEach((project) => {
          const row = table.insertRow();
          const idCell = row.insertCell(0);
          const projectCell = row.insertCell(0);
          const priceCell = row.insertCell(0);
          idCell.innerHTML = project.id;
          projectCell.innerHTML = project.project;
          priceCell.innerHTML = project.project;
        });
      })
      .catch((error) => console.error(error));
  });
});
