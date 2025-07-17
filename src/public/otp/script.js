const otp = document.querySelector("#otp");
const form = document.querySelector(".otp-form");
const msg = document.querySelector(".msg-box");

const domain = 'http://localhost:3001'

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.classList.remove("none");
  msg.textContent = "Verifying.. Reload the page if it takes too long";

  (async () => {
    try {
       await axios.post(
        `${domain}/api/auth/otp`,
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
        window.location.replace(`${domain}/`);
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
