const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let playerId = null
let playerData = { x: 250, y: 350, width: 25, height: 25, color: getRandomColor(), room: 0 }
let playerMetadata = { speed: 5, vx: 0, vy: 0 }
const platforms = [
  { x: 0, y: 0, width: 800, height: 25 },
  { x: 0, y: 600 - 25, width: 800, height: 25 },
  { x: 0, y: 0, width: 25, height: 600 },
  { x: 800 - 25, y: 0, width: 25, height: 600 },

  { x: 100, y: 400, width: 200, height: 25 },
  { x: 300, y: 300, width: 200, height: 25 },
  { x: 300, y: 500, width: 200, height: 25 },
  { x: 500, y: 400, width: 200, height: 25 },
]

let otherPlayers = new Map()

// WebSocket connection to the server
const ws = new WebSocket('ws://localhost:8080')

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)

  if (message.type === 'init') {
    playerId = message.id
    console.log(`Player ${playerId} joined with initial data`, playerData)
  }

  if (message.type === 'update') {
    if (message.id !== playerId) {
      otherPlayers.set(message.id, message.data)
    }
  }

  if (message.type === 'delete') {
    otherPlayers.delete(message.id)
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    playerMetadata.vx = -playerMetadata.speed
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    playerMetadata.vx = playerMetadata.speed
  } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
    if (playerMetadata.onGround) {
      playerMetadata.vy = -10 // Jump speed
    }
  }
})

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'ArrowRight' || e.code === 'KeyD') {
    playerMetadata.vx = 0
  }
})

function applyGravity() {
  playerMetadata.vy += 0.4
}

function checkPlatformCollision() {
  playerMetadata.onGround = false
  platforms.forEach(platform => {
    if (playerData.x + playerData.width > platform.x && playerData.x < platform.x + platform.width &&
      playerData.y + playerData.height >= platform.y && playerData.y <= platform.y + platform.height) {

      console.log(playerMetadata.vy, playerData.y - platform.y)
      if (playerMetadata.vy > 0 && playerData.y < platform.y) {
        playerData.y = platform.y - playerData.height
        playerMetadata.vy = 0
        playerMetadata.onGround = true
      } else if (playerMetadata.vy <= 0 && playerData.y > platform.y) {
        playerData.y = platform.y + platform.height
        playerMetadata.vy = 0
      }
    }
  })
}

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')
}

function updatePlayerData() {
  playerData.x += playerMetadata.vx
  playerData.y += playerMetadata.vy

  applyGravity()
  checkPlatformCollision()

  if (playerId != null) {
    ws.send(JSON.stringify(playerData))
  }
}

setInterval(updatePlayerData, 10)

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = playerData.color
  ctx.fillRect(playerData.x, playerData.y, playerData.width, playerData.height)

  for (let data of otherPlayers.values()) {
    ctx.fillStyle = data.color
    ctx.fillRect(data.x, data.y, data.width, data.height)
  }

  ctx.fillStyle = '#000000'
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
  })

  requestAnimationFrame(gameLoop)
}

gameLoop()
