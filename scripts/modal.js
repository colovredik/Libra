fetch("/favorites")
    .then(r => r.json())
    .then(data => {
        window.favorites = data.map(row => row.book_id);
    });

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const booksContainer = document.getElementById("booksContainer");
const fav = document.getElementById("modal-fav");

if (booksContainer){
    booksContainer.addEventListener("click", function(event){
        const card = event.target.closest(".book-card");
        const read = event.target.closest(".read-btn");
        if(read){
            const bookId = parseInt(card.dataset.id);
            const allBooks = window.books || window.favorites || [];
            const book = allBooks.find(b => b.id === bookId);
            if (book && book.file_path) {
                 window.open("../" + book.file_path, "_blank");
            }
            return;
        }
        if(!card) return;

        const bookId = parseInt(card.dataset.id);
        const allBooks = window.books || window.favorites || [];
        const book = allBooks.find(b => b.id === bookId);
        modalOverlay.dataset.bookId = book.id;

        modalOverlay.style.display = "block";
        document.getElementById("modalImage").src = "../" + book.image;
        document.getElementById("modalTitle").textContent = book.title;
        document.getElementById("modalAuthor").textContent = book.author;
        document.getElementById("modalYear").textContent = "Год: " + book.year;
        document.getElementById("modalPages").textContent = "Количество страниц: " + book.pages;
        document.getElementById("modalDescription").textContent = book.description;

        const isFav = window.favorites.includes(book.id);
       if (fav) {
    if (isFav) {
        fav.classList.add("active-fav");
    } else {
        fav.classList.remove("active-fav");
    }
}
    })

    modalClose.addEventListener("click", function(){
        modalOverlay.style.display = "none";
    })

    modalOverlay.addEventListener("click", function(event){
        if (event.target === modalOverlay){
            modalOverlay.style.display = "none";
        }
    })

if (fav){
fav.addEventListener("click", function(){
        console.log("Клик по сердечку! bookId:", modalOverlay.dataset.bookId);
    const bookId = parseInt( modalOverlay.dataset.bookId);
    const exists = window.favorites.includes(bookId);

        if(exists){
            window.favorites = window.favorites.filter(id => id !== bookId);
            fetch(`/favorites/${bookId}`, {
                method: "DELETE"
            })
             fav.classList.remove("active-fav");
        }
        else {
            window.favorites.push(bookId);
          fetch("/favorites", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ book_id: bookId})
          })
                 fav.classList.add("active-fav");

           
        }
    })}
    
}
    