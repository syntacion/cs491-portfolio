// Get the canvas and context
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Game variables
let score = 0
let playerX = canvas.width / 2
let playerY = canvas.height - 50
let playerWidth = 40
let playerHeight = 30
let playerSpeed = 5
let bullets = []
let enemies = []
let enemySpeed = 1
let enemyWidth = 40
let enemyHeight = 30

// Key states
let keys = {
  left: false,
  right: false,
  shoot: false,
}

// Set up player movement and shooting
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    keys.left = true
  }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    keys.right = true
  }
  if (e.code === 'Space') {
    keys.shoot = true
  }
})

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    keys.left = false
  }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    keys.right = false
  }
  if (e.code === 'Space') {
    keys.shoot = false
  }
})

// Create an enemy
function createEnemy() {
  const enemyX = Math.random() * (canvas.width - enemyWidth)
  enemies.push({ x: enemyX, y: -enemyHeight, width: enemyWidth, height: enemyHeight })
}

// Move the player
function movePlayer() {
  if (keys.left && playerX > 0) {
    playerX -= playerSpeed
  }
  if (keys.right && playerX < canvas.width - playerWidth) {
    playerX += playerSpeed
  }
}

// Shoot a bullet
function shootBullet() {
  if (keys.shoot) {
    bullets.push({ x: playerX + playerWidth / 2 - 5, y: playerY - 10, width: 10, height: 20 })
    keys.shoot = false // Prevent shooting multiple bullets at once
  }
}

// Move bullets
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= 5 // Move bullet up
    if (bullets[i].y < 0) {
      bullets.splice(i, 1) // Remove bullet if it goes off-screen
      i--
    }
  }
}

// Move enemies
function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemySpeed // Move enemy down
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1) // Remove enemy if it goes off-screen
      i--
    }
  }
}

// Check for collision between bullets and enemies
function checkCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (bullets[i].x < enemies[j].x + enemies[j].width &&
          bullets[i].x + bullets[i].width > enemies[j].x &&
          bullets[i].y < enemies[j].y + enemies[j].height &&
          bullets[i].y + bullets[i].height > enemies[j].y) {
        // Bullet hit enemy
        bullets.splice(i, 1)
        enemies.splice(j, 1)
        score += 10 // Increase score
        document.getElementById('score').textContent = score
        i--
        break
      }
    }
  }
}

// Draw everything on the canvas
function draw() {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw player
  ctx.fillStyle = '#004477'
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight)

  // Draw bullets
  ctx.fillStyle = '#ff4444'
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height)
  }

  // Draw enemies
  ctx.fillStyle = '#00aa00'
  for (let i = 0; i < enemies.length; i++) {
    ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)
  }
}

// Game loop
function gameLoop() {
  movePlayer()
  shootBullet()
  moveBullets()
  moveEnemies()
  checkCollisions()
  draw()

  // Create new enemies
  if (Math.random() < 0.02) {
    createEnemy()
  }

  requestAnimationFrame(gameLoop)
}

// Start the game
gameLoop()
