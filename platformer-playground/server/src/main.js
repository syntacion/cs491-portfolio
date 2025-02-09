const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

let nextPlayerId = 1
const players = new Map()

wss.on('connection', ws => {
  const player = {
    id: nextPlayerId++,
    data: {},
    ws,
  }

  players.set(player.id, player)

  ws.send(JSON.stringify({ type: 'init', id: player.id }))

  console.log(`Player ${player.id} joined`)

  for (let [id, p] of players) {
    if (id !== player.id) {
      ws.send(JSON.stringify({ type: 'update', id, data: p.data }))
    }
  }

  ws.on('message', message => {
    player.data = JSON.parse(message)
    for (let p of players.values()) {
      if (p !== player) {
        p.ws.send(JSON.stringify({ type: 'update', id: player.id, data: player.data }))
      }
    }
  })

  ws.on('close', () => {
    console.log(`Player ${player.id} left`)
    players.delete(player.id)
    for (let p of players.values()) {
      p.ws.send(JSON.stringify({ type: 'delete', id: player.id }))
    }
  })
})
