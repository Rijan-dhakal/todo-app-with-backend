const email = document.querySelector('#email')
const password = document.querySelector('#password')
const msgBox = document.querySelector('.msg-box')
const form = document.querySelector('.login-form')

form.addEventListener('submit', (e)=>{
    e.preventDefault();

   const isValid = validateInput(email.value, password.value)

   if(!isValid){  
    errorToggle('Please try again..')
    return
}

    sendDetails(email.value, password.value)
})


const validateInput = (email, password)=>{
    if(!email){
        errorToggle("Enter a valid email")
        return false
    }
    if(!password || password.length < 6){
        errorToggle("Password must be atleast 6 character long")
        return false
    }

    return true
}

const errorToggle = (err) => {
  msgBox.classList.remove("none");
  msgBox.textContent = err;
};


const sendDetails = async (email, password) => {
    errorToggle('Loggingin.. Please reload the page if it takes too long')
    try {

        await axios.post('http://localhost:3001/api/auth/login', {
            email,
            password
        },
        {
           withCredentials: true,
           headers: {
          "Content-Type": "application/json",
        },
        }
    )

    errorToggle("Logged In.. Redirecting within 2 seconds")
    setTimeout(() => {
        window.location.replace('http://localhost:3001')
    }, 1500);

    } catch (error) {
        if(error?.response?.data?.message){
            errorToggle(error.response.data.message)
        } else{
            errorToggle(error.message || "An unexpected error occured. Please try again")
        }
    }
}


const passwordToggle = function() {
    const toggle = document.querySelector('.password-toggle')
    toggle.addEventListener('click', ()=>{

        const parent = toggle.closest('.password-input').querySelector('input')
        const icon = toggle.querySelector('i')
    
        const isPassword = parent.type === 'password'

        parent.type = isPassword ? 'text':'password'

        if(icon){
            icon.classList.toggle('fa-eye')
            icon.classList.toggle('fa-eye-slash')
        }


    })
    
}

passwordToggle()