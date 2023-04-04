document.addEventListener("DOMContentLoaded", function () {
  const addUserForm = document.querySelector("#add-user-form");

  addUserForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.querySelector("#name-input");

    const newUser = {
      name: nameInput.value,
    };

    fetch("http://localhost:3000/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("User added successfully!");
        nameInput.value = "";
        emailInput.value = "";
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        alert("Error adding user. Please try again later.");
      });
  });
});
