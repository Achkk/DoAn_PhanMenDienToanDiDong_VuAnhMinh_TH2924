const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Cấu hình Database
const dbConfig = {
  user: "sa",
  password: "Anhminh178@", // <--- NHỚ ĐIỀN LẠI MẬT KHẨU VÀO ĐÂY
  server: "localhost",
  database: "ChatDB", // Nếu lúc nãy bạn dùng ChatAppDB thì đổi lại nhé
  options: {
    instanceName: "SQLEXPRESS01",
    encrypt: false,
    trustServerCertificate: true,
  },
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Kết nối SQL Server
sql
  .connect(dbConfig)
  .then(() => {
    console.log("✅ Đã kết nối Database thành công!");
  })
  .catch((err) => console.log("❌ Lỗi Database:", err));

// API 1: Lấy tin nhắn giữa 2 người cụ thể
app.get("/api/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    // Dùng tham số @u1, @u2 để truy vấn chéo giữa 2 người
    let result = await new sql.Request()
      .input("u1", sql.NVarChar, user1)
      .input("u2", sql.NVarChar, user2).query(`
                SELECT * FROM Messages 
                WHERE (Sender = @u1 AND Receiver = @u2) 
                   OR (Sender = @u2 AND Receiver = @u1) 
                ORDER BY Timestamp ASC
            `);
    res.json(result.recordset);
  } catch (err) {
    console.log("Lỗi GET:", err);
    res.status(500).send("Lỗi lấy tin nhắn");
  }
});

// API 2: Gửi tin nhắn (Đã có thêm cột Receiver)
app.post("/api/messages", async (req, res) => {
  const { sender, receiver, content } = req.body;
  try {
    await new sql.Request()
      .input("sender", sql.NVarChar, sender)
      .input("receiver", sql.NVarChar, receiver)
      .input("content", sql.NVarChar, content)
      .query(
        "INSERT INTO Messages (Sender, Receiver, Content) VALUES (@sender, @receiver, @content)",
      );

    res.status(201).send("OK");
  } catch (err) {
    console.log("Lỗi POST:", err);
    res.status(500).send("Lỗi gửi tin nhắn");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:3000`);
});
