const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:8080", "http://127.0.0.1:8080"]
    }
})
let players = {}
console.log("Started")
io.on("connection", socket => {
    console.log(socket.id)
    socket.on('disconnect', () => {
        delete players[socket.id]
        console.log('User disconnected',socket.id);
    });
    let newPlayer = [[100, 100], 10];
    players[socket.id] = newPlayer
    socket.on("chat", (string) =>{
        socket.broadcast.emit("chat", string)
    })
    socket.on("players", (all) =>{
        socket.emit("players", players)
    })
    socket.on("positionUpdate", (position) =>{
        if (Math.abs(position[0]-players[socket.id][0][0]) <= players[socket.id][1] || Math.abs(position[1]-players[socket.id][0][1]) <= players[socket.id][1]){
            players[socket.id][0] = position
            socket.broadcast.emit("positionUpdate",[players[socket.id][0], false])
        }else{
            socket.emit("positionUpdate", [players[socket.id][0], true])
        }
    })
})