require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");

const Register = require("./models/registers");

const PORT = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


app.use(express.json());

// To get data from HTML from
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({
            email: email
        });

        //Compare db password with user input password
        const isMatch = await bcrypt.compare(password, useremail.password);

        const token =  await useremail.generateAuthToken();

        if (isMatch) {

            res.status(201).render("index");
        } else {
            res.send("Invalid login details");
        }

    } catch (err) {
        res.status(400).send("Invalid login details");
    }
});

//Create new user
app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            });
            const token =  await registerEmployee.generateAuthToken();

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        } else {
            res.send("Password not match");
        }
    } catch (err) {
        res.status(400).send(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server listing on ${PORT}`);
})