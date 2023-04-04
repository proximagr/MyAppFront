document.addEventListener("DOMContentLoaded", function () {
  const listUsersButton = document.querySelector("#list-users-btn");

  listUsersButton.addEventListener("click", function () {
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users/list-users")
      .then((response) => response.json())
      .then((data) => {
        const table = document.querySelector("#users-table");
        table.innerHTML = "";
        data.forEach((user) => {
          const row = table.insertRow();
          const nameCell = row.insertCell(0);
          const emailCell = row.insertCell(1);
          nameCell.innerHTML = user.name;
          emailCell.innerHTML = user.email;
        });
      })
      .catch((error) => console.error(error));
  });
});
