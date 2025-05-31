const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:8080", "http://127.0.0.1:8080"]
    }
})
console.log("s")
io.on("connection", socket => {
    console.log(socket.id)
    socket.on("chat", (string) =>{
        socket.broadcast.emit("chat", string)
        console.log(string)
    })
})