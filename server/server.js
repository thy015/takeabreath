const PORT = process.env.PORT || 4000;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const morgan = require("morgan");
const http = require("http");
const swaggerUI=require('swagger-ui-express')
const swaggerSpec=require('./docs/swagger')
const {useSSOCallback} = require('@htilssu/wowo');

const HotelListRouter = require("./src/routes/HotelList/hotelList.route");
const RoomListRouter = require("./src/routes/RoomList/roomList.route");
const signUpRouter = require("./src/routes/signUp/signUp.route");
const bookRouter = require("./src/routes/BookRoom/book.route");
const reqCancelRouter = require("./src/routes/BookRoom/cancelReq.route");
const VoucherRoute = require("./src/routes/Voucher/voucher.route")
const MailRoute=require('./src/routes/MailService/mail.route')
const walletRouter = require("./src/routes/Wallet/wallet.route")
//always put first

// Cấu hình middleware

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("combined"));
useSSOCallback(app)

const allowedOrigins = ["http://localhost:3000",
    "https://takeabreath.io.vn",
    "https://wowo.htilssu.id.vn/assets/remoteEntry.js",
    "https://takeabreath-frontend.vercel.app",
    "https://www.sandbox.paypal.com",
    "https://takeabreath.vercel.app",
    "https://vercel.live",
    "https://sso.htilssu.id.vn",
    "https://wowo.htilssu.id.vn",
    "https://maps.googleapis.com"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))) {
                return callback(null, true);
            }
            console.error("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
// swagger config
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
console.log(`Swagger: https://takeabreath.vercel.app/api-docs`)
app.use("/api/roomList", RoomListRouter);
app.use("/api/hotelList", HotelListRouter);
app.use("/api/auth", signUpRouter);
app.use("/api/booking", bookRouter);
app.use("/api/cancelReq", reqCancelRouter);
app.use("/api/voucher", VoucherRoute);
app.use('/api/email',MailRoute);
app.use('/api/wallet',walletRouter);
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
