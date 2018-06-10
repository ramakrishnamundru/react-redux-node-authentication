# React, Redux, NodeJS, MongoDB starter kit with authentication mechanism (JWT).

Project is separated into:
- frontend application(React, Redux)
- api(NodeJS, express, MongoDB)

### How to run

1. Install mongodb: https://www.mongodb.com/download-center?jmp=nav#community
2. Use correct version of node - tested on node 9.0.0 - can be easily done with https://github.com/creationix/nvm

Go to front folder and run:
```sh
$ npm install
$ npm run build
$ npm run serve
```

Go to api folder:
copy or rename config/config.example.js as config/config.js

```sh
cp config/config.example.js config/config.js
```
and run:
```sh
$ npm install
$ npm run dev
```

Or just type to open frontend and api part of project in separate terminal tabs at once:
```sh
$ ./start.sh
```

### Next steps
configure application with docker

### Demo application:
https://guarded-sea-39932.herokuapp.com/#/
