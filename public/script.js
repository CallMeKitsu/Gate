function display() {
  let sockets = JSON.parse(get('https://gate-serv.kitsuforyou.repl.co/sockets'))
  document.querySelector(`#sockets`).innerHTML  = ""

  for(let socket of sockets) {
    let ID = socket[0]
    let infos = socket[1]
    document.querySelector(`#sockets`).innerHTML += `<div class="socket">
      <span>${ID}</span>
      <span>${infos.IP}</span>
      <span>${infos.host}</span>
      <span>${infos.name}</span>
      <span>${infos.os}</span>
    </div>`
  }
}

setInterval(() => {
  display()
}, 5000)