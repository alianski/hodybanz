const socket = io("http://localhost:3000")
const sendButton = document.getElementById("sendButton")
const input = document.getElementById("input")

socket.on("connect", () => {
    console.log("You connected with id:", socket.id)
    socket.emit("chat", "Hello!")
    console.log("Hello!")
})

socket.on("chat", message => {
    console.log(message)
})

function chat(){
    socket.emit("chat",input.value)
    console.log(input.value)
    input.value = ""
}

sendButton.onclick = function(){chat()};