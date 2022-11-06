
const login = () => {
    console.log("ASDASDASD")
    console.log(document.getElementById("username"))
    console.log(document.getElementById("password"))
    fetch('https://localhost:7070/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": document.getElementById("username") , "password": document.getElementById("password")})
})
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}