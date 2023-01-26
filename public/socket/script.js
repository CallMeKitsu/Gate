let queryString = window.location.search
let url = new URLSearchParams(queryString)
let sockets = JSON.parse(get('https://gate-serv.kitsuforyou.repl.co/sockets'))

function display() {
  let socket = url.get('id')
  socket = sockets.find(x => x[0] == socket)

  document.querySelector('body').innerHTML += socket[1]
}