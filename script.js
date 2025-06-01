const socket = io("http://localhost:3000")
const sendButton = document.getElementById("sendButton")
const input = document.getElementById("input")
const player = document.getElementById("player")
let position = [100,100]
let gravity = 10
let enemies = {}
socket.on("connect", () => {
    console.log("You connected with id:", socket.id)
    socket.emit("players", true)
})

socket.on("chat", message => {
    console.log(message)
})

socket.on("players", data => {
    for (let key in data) {
        if (data.hasOwnProperty(key)) { // check if the key is the object's own property
            if (key == socket.id){
            }else{
                if (key in enemies){
                    enemies[key] = [enemies[key][0], data[key][0], data[key][1]]
                    enemies[key][0].style.top = enemies[key][1][1]+"px"
                    enemies[key][0].style.left = enemies[key][1][0]+"px"
                }else{
                    let div = document.createElement('div')
                    div.className = "character"
                    div.id = "enemy"
                    div.style.top = data[key][0][1]+"px"
                    div.style.left = data[key][0][0]+"px"
                    document.body.appendChild(div)
                    enemies[key] = [div, data[key][0], data[key][1]]
                }
            }
        }
    }
    for (let key in enemies){
        if (key in data){}else{
            enemies[key][0].remove()
            delete enemies[data]
        }
    }
})

socket.on("positionUpdate", data => {
    if (data[1] == true){
        position = data[0]
    }
})

function chat(){
    socket.emit("chat",input.value)
    console.log(input.value)
    input.value = ""
}

sendButton.onclick = function(){chat()};

document.addEventListener('keydown', function(event) {
    const step = 10
    let posChanged = fall
    if (event.key == "a"){
        position[0] = position[0] - step;
        posChanged = true
    }
    if (event.key == "d"){
        position[0] = position[0] + step;
        posChanged = true
    }
    if (event.key == "w"){
        position[1] = position[1] - step;
        posChanged = true
    }
    if (event.key == "s"){
        position[1] = position[1] + step;
        posChanged = true
    }
    if (posChanged==true){
        socket.emit("positionUpdate", position)
    }
});

function fall(deltaTime){
    position[1] += 1
}
let lastTime
function mainLoop() {
    socket.emit("players", true)
    player.style.top = position[1]+"px"
    player.style.left = position[0]+"px"
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    //fall(deltaTime)
    requestAnimationFrame(mainLoop);
}
mainLoop()