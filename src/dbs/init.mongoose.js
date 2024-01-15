"use strict";
// sử dụng single ton để kết nói db
// => ưu điểm là sẽ tạo duy nhất một kết nói tránh trường hợp tạo nhiều kết nối mới gây quá tải connect db
const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017/ShopDev";

class Database {
  constructor() {
    this.connect();
  }
  //connect
  connect(type = "mongoose") {
    if (1 === 1) {
      // môi trường dev
      mongoose.set("debug", true); // in ra các query khi gọi tới
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => console.log("Connected To Mongodb Singleton"))
      .catch((err) => console.log(err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
