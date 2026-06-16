
const akk = document.getElementById("akk");
if(akk){
    fetch("/me")
        .then(response => response.json())
        .then(result => {
        console.log(result)
         if(result.username){
            akk.textContent = result.username;
        }
        else{
                        let page = window.location.pathname;
            if(page == "/pages/my-books.html" || page == "/pages/favorites.html"){
                window.location.href = "/pages/login.html";
            }
        }

});
}

const burger = document.getElementById("burger");
if (burger) {
    burger.addEventListener("click", function() {
        document.querySelector(".ulmenu").classList.toggle("show");
    });
}

