document.addEventListener('DOMContentLoaded', function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector(".input_box input[type='email']").value;
    const password = document.querySelector(".input_box input[type='password']").value;
    const rememberMe = document.querySelector(".remember input[type='checkbox']").checked;

    // Email validation pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Check if password field is filled
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    console.log("Form Submitted");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);

    alert("Login Successful!");
  });
});
