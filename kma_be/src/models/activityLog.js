module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define("ActivityLog", {
      actor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      actor_role: {
        type: DataTypes.ENUM("admin", "daoTao", "khaoThi", "giamDoc", "quanLiSinhVien"),
        allowNull: false
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      endpoint: {
        type: DataTypes.STRING,
        allowNull: false
      },
      request_data: {
        type: DataTypes.JSON
      },
      response_status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: "activity_logs",
      timestamps: false
    });
  
    return ActivityLog;
  };
  