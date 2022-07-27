const os = require("os");
const colors = require("colors");
const sleep = async function(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) }
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Konsole {
  constructor() {
    console.clear()
    this.user = process.env.USERNAME
    this.host = os.hostname()
    this.os = process.platform.toUpperCase()
    this.callback = function(str) { }
    this.socket = "none"
    this.cooldown = 0
    this.default()
  }

  async default() {

    if (this.cooldown !== 0) await sleep(this.cooldown * 1000  + 1000)
    console.log('')
    console.log(` ${`${this.user}@${this.host}`.brightGreen} ${this.os.brightMagenta} ${this.socket.blue}`)

    readline.question(` $ `.white, (input) => {
      if (input === "clear") {
        console.clear()
        this.default()
        return
      }
      this.callback(input)
      this.default()
    })
  }

  async startCD(seconds) {
    this.cooldown = seconds
    for (this.cooldown; this.cooldown !== 0; this.cooldown -= 1) {
      await sleep(1000)
    }
    this.cooldown = 0
  }

  async log(str) {
    str = str.toString()
    str = str.replaceAll('\n', '\n ')
    if (this.cooldown !== 0) await sleep(this.cooldown * 1000)
    console.log(` ${str}`.white)
  }

  async warn(str) {
    str = str.toString()
    str = str.replaceAll('\n', '\n ')
    if (this.cooldown !== 0) await sleep(this.cooldown * 1000)
    console.log(` ${str}`.yellow)
  }

  async error(str) {
    str = str.toString()
    str = str.replaceAll('\n', '\n ')
    if (this.cooldown !== 0) await sleep(this.cooldown * 1000)
    console.log(` ${str}`.grey)
  }
}

module.exports.Konsole = Konsole