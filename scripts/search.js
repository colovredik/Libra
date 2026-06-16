let books = [];
let filteredBooks = [];
let currentFilter = "title";
let usedValues = [];
let currentGenre = "";
let currentObem = "";
let query = "";



    function ApplyFilters(){
        filteredBooks = books.filter(function(book){
    let value = book[currentFilter];
        if(currentGenre !== "" && book.genre !== currentGenre) return false;
    if(currentObem !== ""){
        if(book.pages === null) return false;
       if(currentObem === "100_500"){
        if(book.pages < 100 || book.pages > 500 ) return false;
       }
       if(currentObem === "500_800"){
        if(book.pages < 500 || book.pages > 800) return false;
       }
       if(currentObem === "более800"){
        if(book.pages < 800) return false;
       }
    }
    if(query !== ""){
        if (value === null) return false;
        let lowTitle = value.toLowerCase();
        return lowTitle.includes(query);
    }
    return true;
    })
    }


    function RenderBooks(){
            const booksContainer = document.getElementById("booksContainer");
            const container = document.getElementById("suggestions");
            booksContainer.innerHTML = "";
            filteredBooks.forEach(function(book){
          
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

console.log("Книг изначально: ", books.length);
//получение данных с бд
fetch("/books")
    .then(response => response.json())
    .then(booksFromServer => {
        console.log("Книги загружены: ", booksFromServer.length);
        books = booksFromServer; 
        window.books = books;//тут копия массива с бдшки
        const searchInput = document.getElementById("searchInput"); //поле ввода
        console.log(searchInput);


    searchInput.addEventListener("input", function() {
    console.log("Пользователь печатает: ", searchInput.value);
    query = searchInput.value;//получаем данные в инпута
    query = query.toLowerCase(); 
    ApplyFilters();
    RenderBooks();


    const container = document.getElementById("suggestions");//поле для подсказок
    container.innerHTML = "";

    if(query===""){
        console.log("Поле пустое");
        container.style.display = "none";
    } 
    
    else {
        console.log("Запрос: ", query, "Найдено книг: ", filteredBooks.length);
        container.style.display = "block";//появляется, замена стиля с помощью класса
        let suggestionsList = filteredBooks.slice(0,5);//берём первые 5 книг
        usedValues = [];
        //тут проходимся по тем вариантам, которые до этого срезали
        suggestionsList.forEach(function(list){
            if (!usedValues.includes(list[currentFilter])){
            usedValues.push(list[currentFilter]);
            let element = document.createElement("div");//создаем блок
            element.classList.add("suggestion-item");//стиль добавляем из css
            element.textContent = list[currentFilter];//и текст из массива по title

            //тут логика что будет после нажатия
            element.addEventListener("click", function(){
                searchInput.value = list[currentFilter];//заменям с того что ввёл пользователь на вариант из подсказки
                container.style.display = "none";//убираем подсказку
                query = searchInput.value.toLowerCase();  
            //повторная фильтрация
            ApplyFilters();
            RenderBooks();
        
    });
            container.appendChild(element);
}
        })
    }
        console.log(books);
    });
    //кнопка найти 
    const buttonAuthor = document.getElementById("authorFilter");
    console.log("Кнопка Автор:", buttonAuthor);
    const buttonSeries = document.getElementById("seriesFilter");
    const buttonTitle = document.getElementById("titleFilter");
    buttonTitle.classList.add("active-filter");

    buttonAuthor.onclick =  function(){
        currentFilter = "author";
        console.log("клик по кнопке автор");
        buttonSeries.classList.remove("active-filter");
        buttonTitle.classList.remove("active-filter");
        buttonAuthor.classList.add("active-filter");
        searchInput.value = "";
        query = "";
    }

    
    buttonSeries.onclick = function(){
        currentFilter = "series";
        buttonAuthor.classList.remove("active-filter");
        buttonTitle.classList.remove("active-filter");
        buttonSeries.classList.add("active-filter");
        searchInput.value = "";
        query = "";
    }

    
    buttonTitle.onclick = function(){
        currentFilter = "title";
        buttonAuthor.classList.remove("active-filter");
        buttonSeries.classList.remove("active-filter");
        buttonTitle.classList.add("active-filter");
        searchInput.value = "";
        query = "";
    }
    


    const genre = document.getElementById("genreFilter");
    genre.addEventListener("change", function(){
    currentGenre = genre.value;
    ApplyFilters();
    RenderBooks();


});
    const pages = document.getElementById("obem");
    pages.addEventListener("change", function(){
    currentObem = pages.value;
    ApplyFilters();
    RenderBooks();
    })


   
    



}); 
    