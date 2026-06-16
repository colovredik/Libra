let myBooks = [];

fetch("/my-books")
    .then(r => r.json())
    .then(data => {
        myBooks = data;
        window.books = myBooks;
        RenderMyBooks();
    });

const coverInput = document.getElementById("coverInput");
const fileInput = document.getElementById("fileInput");

function RenderMyBooks(){
    const booksContainer = document.getElementById("booksContainer");
    booksContainer.innerHTML = "";
    myBooks.forEach(function(book){
        booksContainer.innerHTML += `
        <div class="book-card" data-id="${book.id}">
            <img src="../${book.image}" alt="${book.title}" class="book-cover">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <button class="read-btn">Читать</button>
        </div>`;
    });
}

const uploadSidebar = document.getElementById("upload-sidebar");
const uploadModal = document.getElementById("uploadModal");

uploadSidebar.addEventListener("click", function(){
    uploadModal.style.display = "block";
});

document.getElementById("saveBook").addEventListener("click", function(){
    const newBook = {
        id: Date.now(),
        title: document.getElementById("bookTitle").value,
        author: document.getElementById("bookAuthor").value,
        image: "img/stub.png",
        year: document.getElementById("bookYear").value,
        pages: document.getElementById("bookPages").value,
        description: document.getElementById("bookDescription").value
    };

    const formData = new FormData();
    if (coverInput.files.length > 0) {
        formData.append("cover", coverInput.files[0]);
    }
    if (fileInput.files.length > 0) {
        formData.append("pdf", fileInput.files[0]);
    }

    fetch("/upload", {
    method: "POST",
    body: formData
})
.then(r => r.json())
    .then(data => {
        const coverPath = data.cover || "img/stub.png";
        const pdfPath = data.pdf;
        console.log("Отправляю file_path:", pdfPath);
        fetch("/my-books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newBook.title,
                author: newBook.author,
                year: newBook.year,
                pages: newBook.pages,
                description: newBook.description,
                image: coverPath,
                file_path: pdfPath
            })
        })
        .then(r => {
    console.log("Статус:", r.status);
    return r.text();
})
.then(text => {
    console.log("Ответ:", text);
    return JSON.parse(text);
})
        .then(() => fetch("/my-books"))
        .then(r => r.json())
        .then(data => {
            myBooks = data;
            window.books = myBooks;
            RenderMyBooks();
            document.getElementById("bookTitle").value = "";
            document.getElementById("bookAuthor").value = "";
            document.getElementById("bookYear").value = "";
            document.getElementById("bookPages").value = "";
            document.getElementById("bookDescription").value = "";
            coverInput.value = "";
            fileInput.value = "";
            uploadModal.style.display = "none";
        });
    });
});

const uploadModalClose = document.getElementById("uploadModalClose");
uploadModalClose.addEventListener("click", function(){
    uploadModal.style.display = "none";
});

uploadModal.addEventListener("click", function(event){
    if (event.target === uploadModal) {
        uploadModal.style.display = "none";
    }
});

const delet = document.getElementById("delete");
delet.addEventListener("click", function(){
    const bookId = parseInt(modalOverlay.dataset.bookId);
    fetch(`/my-books/${bookId}`, { method: "DELETE" })
    .then(() => fetch("/my-books"))
    .then(r => r.json())
    .then(data => {
        myBooks = data;
        window.books = myBooks;
        RenderMyBooks();
        modalOverlay.style.display = "none";
    });
});