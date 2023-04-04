const listUsersButton = document.querySelector("#list-users-btn");

listUsersButton.addEventListener("click", function () {
  fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
    .then((response) => response.json())
    .then((data) => {
      const table = document.querySelector("#customers");
      table.innerHTML = "";
      data.forEach((user) => {
        const row = table.insertRow();
        const nameCell = row.insertCell(0);
        nameCell.innerHTML = user.name;
      });
    })
    .catch((error) => console.error(error));
});
