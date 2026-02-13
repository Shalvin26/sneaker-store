// to switch between the register and login forms
const loginform=document.getElementById('loginForm');
const registerform=document.getElementById('registerForm');
const toggleBtn=document.getElementById('toggleBtn');
const toggleText=document.getElementById('toggleText');


let isLoginMode=true;

toggleBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    isLoginMode= !isLoginMode;


if(isLoginMode){
    loginform.classList.remove('hidden');
    registerform.classList.add('hidden');
    toggleText.textContent="Don't have an account?";
    toggleBtn.textContent="Register";
}else{
    loginform.classList.add('hidden');
    registerform.classList.remove('hidden');
    toggleText.textContent="Already have an account?";
    toggleBtn.textContent="Login";
}
});

//hanlding request get,post etc

loginform.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email=document.getElementById('loginEmail').value;
    const password=document.getElementById('loginPassword').value;
    const errorMsg=document.getElementById('loginError');

    try{
        const response=await fetch('/api/auth/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
        })
        
        const data=await response.json();

        if(response.ok){
            //saving  token to local storage
           localStorage.setItem('token',data.token);
           localStorage.setItem('user',JSON.stringify(data.user));

           //redirecting to  admin's html page 
           window.location.href='admin.html';
           
        }else{
            errorMsg.textContent=data.message;
        }
    }catch(error){
        errorMsg.textContent='Login Failed. Please try again.';
    }
    
});


//register form handling

registerform.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;
  const errorMsg = document.getElementById('regError');
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, role })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Saving token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // redirecting  to admin.html
      window.location.href = 'admin.html';
    } else {
      errorMsg.textContent = data.message;
    }
  } catch (error) {
    errorMsg.textContent = 'Registration failed. Please try again.';
  }
});