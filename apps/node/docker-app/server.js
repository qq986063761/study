const express = require("express");
const path = require("path");

const app = express();

// 静态文件（前端）
app.use(express.static("public"));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});