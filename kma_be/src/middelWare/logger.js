const { ActivityLog } = require("../models");
const jwt = require("jsonwebtoken");
const { users } = require("../models");

const logActivity = async (req, res, next) => {
    
    const start = Date.now();

    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      console.log ("id " + decoded?.id);
      console.log ("role " + decoded?.role);
      // const user =  users.findOne({ where: { id: decoded?.id } });
      async function getUsernameById(userId) {
        try {
          const user = await users.findOne({ where: { id: decoded?.id  } });
      
          if (!user) {
            console.log("User not found");
            return null;
          }
      
          console.log("Username:", user.username);
          return user.username;
        } catch (error) {
          console.error("Database error:", error);
          return null;
        }}

      console.log ("name " + getUsernameById(decoded?.id));
      
      const mapRole = {
        1 : "daoTao",
        2 : "khaoThi",
        3 : "quanLiSinhVien",
        5 : "giamDoc",
        7 : "admin"
      
      }
      
      res.on("finish", async () => {
        const duration = Date.now() - start;
        try {
          await ActivityLog.create({
            actor_id: decoded?.id || "",
            actor_role: mapRole[decoded?.role] || "admin",
            action: `${req.method} ${req.path}` ,
            endpoint: req.originalUrl,
            request_data: req.body,
            response_status: res.statusCode,
            ip_address: req.ip || req.connection.remoteAddress
          });
        } catch (error) {
          console.error("Logging Error:", error);
        }
      });
    })

  next();
};

module.exports = logActivity;
