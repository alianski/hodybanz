const socket = io("http://localhost:3000")
const player = document.getElementById("player")
let position = [0,0]
let gravity = 10
let enemies = {}
let width = window.innerWidth;
let height = window.innerHeight;
let map = false
const fpsText = document.getElementById("fps")
socket.on("connect", () => {
    console.log("You connected with id:", socket.id)
    socket.emit("players", true)
})

socket.on("chat", message => {
    console.log(message)
})

socket.on("players", data => {
    let player0x = width/2-50/2-position[0]
    let player0y = height/2-100/2-position[1]
    for (let key in data) {
        if (data.hasOwnProperty(key)) { // check if the key is the object's own property
            if (key == socket.id){
                player.style.backgroundColor = data[key][2]
                player.textContent = "You"
            }else{
                if (key in enemies){
                    enemies[key] = [enemies[key][0], data[key][0], data[key][1]]
                    enemies[key][0].style.top = (enemies[key][1][1]+player0y)+"px"
                    enemies[key][0].style.left = (enemies[key][1][0]+player0x)+"px"
                }else{
                    let div = document.createElement('div')
                    div.className = "character"
                    div.id = "enemy"
                    div.textContent = key
                    div.style.backgroundColor = data[key][2]
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

socket.on("chunk", data => {
    map = data
})


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

function drawMap(){
    for (let y = 0; y < map.length; y++){
        for (let x = 0; x < map[y].length; x++){
        }
    }
}

let lastTime
socket.emit("getchunk", 1, 0)
function mainLoop() {
    width = window.innerWidth;
    height = window.innerHeight;
    socket.emit("players", true)
    drawMap()
    player.style.top = '50%';
    player.style.left = '50%';
    player.style.transform = 'translate(-50%, -50%)';
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    let fps = Math.floor(1/deltaTime)+"Fps"
    fpsText.textContent = fps
    //fall(deltaTime)
    requestAnimationFrame(mainLoop);
}
mainLoop()