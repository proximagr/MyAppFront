document.addEventListener("DOMContentLoaded", function () {
  const addUserForm = document.querySelector("#add-user-form");
  const addUserButton = document.querySelector("#add-user-btn");

  addUserForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const name = document.querySelector("#name").value;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/add-user");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("User added successfully!");
        addUserForm.reset(); // Clear the form inputs
      } else {
        alert("Failed to add user.");
      }
    };

    xhr.onerror = function () {
      alert("Network error.");
    };

    const data = JSON.stringify({ name: name });
    xhr.send(data);
  });
});