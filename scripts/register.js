const formlog = document.querySelector(".formlog");
const errorMsg = document.getElementById("errorMsg");
formlog.addEventListener("submit", function(event){
    event.preventDefault();
    const formData = new FormData(formlog);
    const data = new URLSearchParams(formData);
    fetch ("/register", {
        method: "POST",
        body: data
    })
        .then(response => response.json())
        .then(result => {
        console.log(result)
         if(result.message){
            window.location.href = "/pages/login.html";
        }
        else{
            errorMsg.innerHTML = "";
            errorMsg.textContent = result.error;
        }
});
});