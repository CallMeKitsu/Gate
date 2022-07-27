# Gate server side

Gate is a all-in-one malware for educational purpose only. It has been built to illustrate a journalistic video about cybersecurity. The developpement and ideas are open-source and maintained by **@CallMeKitsu**. The usage of this kind of programs is punished by years of jail at minus, stay away from problems and don't use it.

## Dependancies
The app uses **Node.js** runtime and the node packages [colors](https://www.npmjs.com/package/colors) to style the CLI and [socket.io](https://socket.io) to build the socket connection between clients and server. As the server acts as a command-line remoter for all the differents clients, no UI design / package is needed. The whole controls are included into the native Node.js console.

## Documentation

With the actual version of Gate, the following commands are executable from the server by the client (depending on the OS, some could not be supported). The responses are directly sent on the server terminal, or in the local file system if the wanted data is an image / a plain text file.

* `bat` : execute batch code from the command-line interpreter
* `js` : execute javascript code with the Node.js runtime
* `tree` : get a tree representation of the local files
* `cam` : a capture from the webcam is taken and saved
* `keylog` : get a log of all the pressed keys since running
* `select` : select a socket to connect with
* `sockets` : get the list of the connected sockets
* `kill` : kill the connection with the selected socket
* `info` : force the selected client to send its informations