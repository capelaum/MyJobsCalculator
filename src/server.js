const express = require("express");
const server = express();

// middleware
server.use(express.static("public"));

server.get("/", (request, response) => {
  return response.sendFile(`${__dirname}/views/index.html`);
});

server.listen(3000, () => console.log("rodando"));
