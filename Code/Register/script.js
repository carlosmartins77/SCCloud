const { Console } = require("console");

async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log(username, password)
    const url = 'http://localhost:7070/auth/login'
    const data = {
        username,
        password
    }

    const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then((response) => response.json())
        .then((data) => {
            console.log("Token: ", data.token);
            localStorage.setItem("token", data.token)
        })
        .catch((err) => {
            console.log(err);
        });

    // TODO COLOCAR DEPOIS NOS COOKIES O TOKEN

    return true;
}

async function register() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const name = document.getElementById("nome").value;

    const url = 'http://localhost:7070/auth/register'
    const data = {
        username,
        password,
        email,
        name
    }
    console.log(username, password, email, name)
    const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => {
            console.log(err);
        });

    return true;
}