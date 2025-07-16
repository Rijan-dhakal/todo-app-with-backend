const otp = document.querySelector("#otp");
const form = document.querySelector(".otp-form");
const msg = document.querySelector(".msg-box");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.classList.add("none");
  msg.textContent = "";

  (async () => {
    try {
       await axios.post(
        "http://localhost:3001/api/auth/otp",
        { otp: otp.value },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      msg.textContent = "Verified successfully.. Redirecting within 2 seconds";
      msg.classList.remove("none");

      setTimeout(() => {
        window.location.replace("http://localhost:3001/");
      }, 1000);

    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = "Verification failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid OTP or expired. Please check your OTP.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found. Please register again.";
      }
      
      msg.textContent = errorMessage;
      msg.classList.remove("none");
    }
  })();
});
