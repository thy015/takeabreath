const PORT = process.env.PORT || 4000;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const http = require("http");

const HotelListRouter = require("./src/routes/HotelList/hotelList.route");

const signUpRouter = require("./src/routes/signUp/signUp.route");
const bookRouter = require("./src/routes/BookRoom/book.route");

const reqCancelRouter = require("./src/routes/BookRoom/cancelReq.route");
//always put first

// Cấu hình middleware

app.use(bodyParser.json());

app.use(morgan("combined"));

// app.use("/videos", videoRoutes);
const allowedOrigins = ["http://localhost:3000",
  "https://wowo.htilssu.id.vn/assets/remoteEntry.js"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use("/api/hotelList", HotelListRouter);
app.use("/api/auth", signUpRouter);
app.use("/api/booking", bookRouter);
app.use("/api/cancelReq", reqCancelRouter);
//mongo connect

mongoose
  .connect(
    `mongodb+srv://thymai1510:${process.env.MONGO_DB}@cluster0.ibhghsi.mongodb.net/?appName=Cluster0`
  )
  .then(() => {
    console.log("Connect successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static("public"));

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Now streaming on ${PORT}`);
});
