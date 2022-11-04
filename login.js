//1.inclue the packages in our Node.js
var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const { response } = require("express");

//2.connect to our  database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodeloginX"
});

//3.use Packages

// var express = require("express");
var app = express();


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');


app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/login.html"));
});

app.get("/login", function(require, respone) {
    respone.sendFile(path.join(__dirname + "/login.html"));
});


app.post("/auth", function(request, respone) {
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        connection.query(
            "SELECT * FROM accounts WHERE username = ? AND password = ?",
            [username, password],
            function(error, results, fields) {
                if (results.length > 0 ) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    console.log("ควยโอ๊ก")
                    response.redirect("/webboard");

                } else {
                    respone.send("Incorrect Username and/or Password!");
                }
                respone.end();
            }
        );
    } else {
        respone.send("Please enter Username and Password!");
        respone.end();
    }
});

app.get("/home", function(request, response) {
    if (request.session.loggedin) {
        response.send("Welcome back, " + request.session.username + "!");


    } else {
        response.send("Please login to view this page!");
    }response.end();
});
app.get("/signout", function(request, response) {
    request.session.destroy(function (err) {
        response.send("Signout ready!");
        response.end();
    });
});


app.get("/webboard", (req, res) => {
    if (req.session.loggedin)
      connection.query("SELECT * FROM accounts", (err, result) => {
        res.render("index.ejs", {
          posts: result
        });
      console.log(result);
      });
    else
      res.send("You must to login First!!!");
      console.log("You must to login First!!!");
      // res.end();
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});






app.listen(9000);
console.log("runniung on port 9000...");