//INITIALIZATION
const fs = require('fs');
const path = require('path');
const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:8080", "http://127.0.0.1:8080"]
    }
})
const CHUNK_WIDTH = 24
const CHUNK_HEIGHT = 24
let generating = false
let map = require("./savedata/maps/map.json")
let players = {}
//

//FUNCTIONS

function saveMap(maptosave){
    jsonData = JSON.stringify(maptosave, null, 0);
    dirPath = path.join(path.join(__dirname, 'savedata'), "maps")
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    const filePath = path.join(dirPath, 'map.json');
    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('JSON file has been saved.');
        }
    });
}

function generateChunk(x, y){
    if (generating){return false}
    generating = true
    let result = new Array(CHUNK_HEIGHT);

    for (let i = 0; i < CHUNK_HEIGHT; i++) {
        result[i] = new Array(CHUNK_WIDTH);
        for (let i2 = 0; i2 < CHUNK_WIDTH; i2++){
            result[i][i2] = [0, 0]
        }
    }
    generating = false
    return result
}

function loadChunk(x, y){
    if (map.hasOwnProperty("x"+x+"y"+y)){
        return map["x"+x+"y"+y]
    }else{
        let chunk = generateChunk(x,y)
        if (chunk == false){
            return(false)
        }
        map["x"+x+"y"+y] = chunk
        saveMap(map)
        return chunk
    }
}



console.log("Started")
//SERVER <--> CLIENT CONNECTION
io.on("connection", socket => {
    console.log(socket.id)
    socket.on('disconnect', () => {
        delete players[socket.id]
        console.log('User disconnected',socket.id);
    });
    let r = Math.floor(Math.random() * 256); // random value between 0-255
    let g = Math.floor(Math.random() * 256); // random value between 0-255
    let b = Math.floor(Math.random() * 256); // random value between 0-255
    let color = `rgb(${r}, ${g}, ${b})`
    let newPlayer = [[0, 0], 10, color];
    players[socket.id] = newPlayer
    socket.on("chat", (string) =>{
        socket.broadcast.emit("chat", string)
    })
    socket.on("players", (all) =>{
        socket.emit("players", players)
    })
    socket.on("getchunk", (x, y) =>{
        let chunk = loadChunk(x, y)
        socket.emit("chunk", chunk)
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