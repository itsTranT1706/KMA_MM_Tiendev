const { ActivityLog } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { users } = require("../models");

const logActivity = async (req,res,next) => {
  const start = Date.now();
  // console.log(req._startTime);
  
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    // console.log ("id " + decoded?.id);
    // console.log ("role " + decoded?.role);
    // const user =  users.findOne({ where: { id: decoded?.id } });
    async function getUsernameById(userId) {
      try {
        const user = await users.findOne({ where: { id: userId  } });
        
        if (!user) {
          console.log("User not found");
          return null;
        }
        
        // console.log("Username:", user.username);
        return user.username;
      } catch (error) {
        console.error("Database error:", error);
        return null;
      }}
      
    //  getUsernameById(decoded?.id);
      
      const mapRole = {
        1 : "daoTao",
        2 : "khaoThi",
        3 : "quanLiSinhVien",
        5 : "giamDoc",
        7 : "admin"
        
      }

      
      res.on("finish", async () => {
        const duration = Date.now() - start;
        // console.log(req);
        try {
          if (req.method !== "GET") {
            // console.log(req.body.password);
            if (req.body.password) {
              
              const hash = await bcrypt.hash(req.body.password, 10);
              req.body.password = hash;
              // console.log(req.body);
            }

            await ActivityLog.create({
              actor_id: decoded?.id || 0,
              actor_role: mapRole[decoded?.role] || "admin",
              action: `${req.method} : ${req.path}`,
              endpoint: req.originalUrl,
              request_data: req.body,
              response_status: res.statusCode,
              ip_address: req.ip || req.connection.remoteAddress
            });
          }
          } catch (error) {
          console.error("Logging Error:", error);
        }
      });
    })
    
    next();
}

module.exports = logActivity;