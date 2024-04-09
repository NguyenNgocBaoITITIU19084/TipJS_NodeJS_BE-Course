const app = require("./src/app");

const config = require("./src/configs/config.mongodb");

const PORT = config.app.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`server is running on ENV:: ${process.env.NODE_ENV}`);
  console.log(`server is running on PORT:: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Exit Server Express`));
});
