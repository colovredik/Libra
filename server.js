const bcrypt = require("bcryptjs");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const session = require("express-session");
const multer = require("multer");
const db = new sqlite3.Database("./libra_data/libradata.db");
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });


app.get("/books", (req, res) => {

    db.all(
        "SELECT * FROM books",
        [],
        (err, rows) => {

            if (err) {
                res.status(500).json(err);
                return;
            }

            res.json(rows);
        }
    );

});

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(session({
    secret: "libra-secret-key",
    resave: false,
    saveUninitialized: false
}));

app.post("/register", async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username|| !password) {
        res.status(400).json({error: "Поля не заполнены"});
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function(err){
        if (err){
            console.log("Ошибка регистрации:", err.message);
            res.status(400).json({error: "Пользователь уже существует"});
            return;
        }
        else {
            res.json({message: "Регистрация успешна"});
        }
    })
})


app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.get("SELECT * FROM users WHERE username = ?", [username], async function(err, user){
        if(!user){
            res.status(400).json({error: "Пользователя не существует"});
            return;
        }
        else {
            const match = await bcrypt.compare(password, user.password);
            if(match){
                req.session.userId = user.id;
                res.json({message: "Успешно!"});
            }
            else {
    res.status(400).json({ error: "Неверный пароль" });
}
        }
    })
})

app.get("/me", (req, res) => {
    if(!req.session.userId){
         res.status(401).json({error: "Пользователь не авторизован"});
        return;
    }
    else{
        db.get("SELECT id, username FROM users WHERE id = ?", [req.session.userId], function(err, user) {
            if (user){
                res.json({username : user.username});
            }
            else {
                res.status(401).json({error: "Пользователь не авторизован"});
        return;
            }
        } )
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/pages/login.html");
});


app.get("/", (req, res) => {
    res.redirect("/pages/index.html");
});

app.get("/favorites", (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({error: "Пользователь не авторизован"});
    }
    db.all("SELECT book_id FROM favorites WHERE user_id = ?", [req.session.userId], function(err, rows){
        if(err){
            return res.status(500).json({error: "Ошибка сервера"});
        }
        else{
            return res.json(rows);
        }
    })
})

app.post("/favorites", (req, res) => {
    if (!req.session.userId) {
    return res.status(401).json({ error: "Не авторизован" });
 }
    const book_id = req.body.book_id;
    db.run("INSERT INTO favorites (user_id, book_id) VALUES (?, ?)", [req.session.userId, book_id],  function(err) {
    if (err) {
        return res.status(500).json({ error: "Ошибка" });
    }
    res.json({ message: "Добавлено" });
}
    );
});

app.delete("/favorites/:book_id", (req,res) => {
        if (!req.session.userId) {
    return res.status(401).json({ error: "Не авторизован" });
 }
    db.run("DELETE FROM favorites WHERE user_id = ? AND book_id = ?", [req.session.userId, req.params.book_id], function(err){
        if(err){
            return res.status(500).json({ error: "Ошибка" });
        }
        res.json({ message: "Удалено" });
    })

})

app.get("/my-books", (req, res) => {
            if (!req.session.userId) {
    return res.status(401).json({ error: "Не авторизован" });
 }
 db.all("SELECT * FROM user_books WHERE user_id = ?", [req.session.userId], function(err, rows){
    if(err){
        return res.status(500).json({error: "Ошибка сервера"});
    }
    else {
        return res.json(rows);
    }
 })
})

app.post("/my-books", (req, res) => {
       if (!req.session.userId) {
    return res.status(401).json({ error: "Не авторизован" });
 }
 const title = req.body.title;
 const author = req.body.author;
 const year = req.body.year;
 const pages = req.body.pages;
 const description = req.body.description; 
 db.run("INSERT INTO user_books (user_id, title, author, year, pages, description, image, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.session.userId, title, author, year, pages, description, req.body.image, req.body.file_path], function(err){
        if(err){
        return res.status(500).json({error: "Ошибка сервера"});
    }
    else {
        return res.json({message: "Добавлено"});
    }
 })
})

app.delete("/my-books/:book_id", (req, res) =>{
           if (!req.session.userId) {
    return res.status(401).json({ error: "Не авторизован" });
 }
  db.run("DELETE FROM user_books WHERE id = ? AND user_id = ?", [ req.params.book_id, req.session.userId], function(err){
        if(err){
            return res.status(500).json({ error: "Ошибка" });
        }
        res.json({ message: "Удалено" });
    })

})

app.post("/upload", upload.fields([{name: "cover"}, {name: "pdf"}]), (req, res) =>{
    const coverPath = req.files["cover"]?"uploads/" + req.files["cover"][0].filename : null;
    const pdfPath = req.files["pdf"] ? "uploads/" + req.files["pdf"][0].filename : null;
    res.json({cover: coverPath, pdf: pdfPath});
});

app.use("/uploads", express.static("uploads"));

app.use(express.static("."));
app.listen(3000, () => {
    console.log("Server started");
});
