const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector(".register-form");
const errorBox = document.querySelector(".error");
const successBox = document.querySelector(".success");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.textContent = "";
  errorBox.classList.add("none");
  successBox.textContent = "";
  successBox.classList.add("none");

  const isValid = validateInput(username.value, email.value, password.value);
  if (!isValid) {
    alert("Please refresh and try again");
    return;
  }

  sendDetails(username.value, email.value, password.value);
});

const sendDetails = async (username, email, password) => {
  try {
    successBox.classList.remove("none");
    errorBox.classList.add("none");
    successBox.textContent = "Registering.. Reload the page if it takes too long";

     await axios.post(
      "http://localhost:3001/api/auth/register",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // if(response.status)

    successBox.classList.remove("none");
    errorBox.classList.add("none");
    successBox.textContent = "Registered Successfully.. Redirecting within 2 seconds";

    setTimeout(() => {
      window.location.replace("http://localhost:3001/otp");
    }, 1000);

  } catch (error) {
    successBox.classList.add("none");
    errorBox.classList.remove("none");

    if (error.response && error.response.data && error.response.data.message) {
      errorBox.textContent = error.response.data.message;
    } else {
      errorBox.textContent = error.message || "An unexpected error occurred";
    }
  }
};

const validateInput = (username, email, password) => {
  if (!username || username.length < 3) {
    errorToggle("Username must be at least 3 characters long");
    return false;
  }

  if (!email) {
    errorToggle("Valid Email is required");
    return false;
  }

  if (!password || password.length < 6) {
    errorToggle("Password must be at least 6 characters long");
    return false;
  }

  return true;
};

const errorToggle = (err) => {
  errorBox.classList.remove("none");
  successBox.classList.add("none");
  errorBox.textContent = err;
};

const passwordToggle = () => {
  const passwordToggles = document.querySelectorAll(".password-toggle");

  passwordToggles.forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const element = target.closest(".password-input").querySelector("input");
      const icon = target.querySelector("i");

      const isPassword = element.type === "password";
      element.type = isPassword ? "text" : "password";

      if (icon) {
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      }

      target.classList.toggle("active");
    });
  });
};

passwordToggle();
