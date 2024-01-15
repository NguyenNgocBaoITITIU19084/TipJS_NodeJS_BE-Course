"use strict";
// cách thông thường sẽ gây ra quá tải do tạo quá nhiều kết nối
const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/ShopDev";

mongoose
  .connect(connectString)
  .then((_) => console.log("Connected To Mongodb"))
  .catch((err) => console.log(err));

if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
