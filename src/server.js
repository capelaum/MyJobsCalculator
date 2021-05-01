const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path");

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// var publicDir = path.join(__dirname, '../public');
// server.use(express.static(publicDir));

server.use(express.static("../public"));
server.use(express.urlencoded({ extended: true })); // usar o req.body
server.use(routes);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log("rodando"));
