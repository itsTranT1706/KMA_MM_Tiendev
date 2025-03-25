const express = require("express");


//logger
// const logs = require('./middleware/logger');
// logs.logger();
// const morgan = require('morgan');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(express.json());

// // Ghi log request vào file chung
// app.use(morgan('combined', {
//   stream: fs.createWriteStream(path.join(__dirname,'../src/logs/app.log'), { flags: 'a' })
// }));



const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./models");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
const port = process.env.APPPORT;
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


//logger
const logActivity = require("./middelWare/logger");
app.use(logActivity);
// const logsRouter = require("./routes/logs");
// app.use("/api/logs", logsRouter);


routes(app);
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối với cơ sở dữ liệu đã được thiết lập thành công.");
  })
  .catch((error) => {
    console.error("Không thể kết nối tới cơ sở dữ liệu:", error);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
