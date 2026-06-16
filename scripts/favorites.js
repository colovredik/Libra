let favorites = [];
let books = [];
let bookIds = [];


fetch("/favorites")
    .then(r => r.json())
    .then(data => {
        fetch("/books")
    .then(response => response.json())
    .then(allBooks => {
        books = allBooks;
        bookIds = data.map(row => row.book_id);
        favorites = allBooks.filter(book => bookIds.includes(book.id));
        window.favorites = favorites;
         RenderFavorites();
    })

    });



 function RenderFavorites(){
            const booksContainer = document.getElementById("booksContainer");
            booksContainer.innerHTML = "";
           favorites.forEach(function(book){
          
        booksContainer.innerHTML +=`
        <div class="book-card" data-id="${book.id}">
            <img 
            src="../${book.image}"

            alt="${book.title}"
            class="book-cover">

            <h3 
            class="book-title"
            >${book.title}</h3>

            <p class="book-author">
            ${book.author}
            </p>

            <button class="read-btn">
            Читать
            </button>
        </div>`
    })

}



 