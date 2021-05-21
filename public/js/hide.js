LoginDiv = document.getElementById("LoginDiv");
LoginDiv.style.display = "none";
LoginB = document.getElementById("login2");
BotoesDiv = document.getElementById("button-center");
    

    LoginB.addEventListener('click', (e) =>{
        e.preventDefault();

        BotoesDiv.style.display = "none";
        LoginDiv.style.display = "inline";
        
    })

function LoginConfig(){
}