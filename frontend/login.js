document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = loginForm.elements["email"].value;
    const password = loginForm.elements["password"].value;

    authenticateUser(email, password);
  });

  function authenticateUser(email, password) {
    const data = { email, password };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert("Login successful!");
          if (email == "admin@gmail.com" && password == "Admin@123") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/sblogs";
          }
        } else {
          alert("Invalid email or password. Please try again.");
          loginForm.elements["password"].value = "";
        }
      })
  }
});
