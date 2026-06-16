console.log("catalog.js загружен");
let books = [];

fetch("/books")
    .then(response => response.json())
    .then(data => {

        books = data;
        console.log(books);
        window.books = books;
        
        const container = document.getElementById("booksContainer");

        books.forEach(book => {

            container.innerHTML += `
                <div class="book-card" data-id="${book.id}">

                    <img
                        src="../${book.image}"
                        alt="${book.title}"
                        class="book-cover"
                    >

                    <h3 class="book-title">
                        ${book.title}
                    </h3>

                    <p class="book-author">
                        ${book.author}
                    </p>

                    <button class="read-btn">
                        Читать
                    </button>

                </div>
            `;

        });

    })
    .catch(error => {
        console.error(error);
    });