module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("activity_logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      actor_role: {
        type: Sequelize.ENUM("admin", "daoTao", "khaoThi", "giamDoc", "quanLiSinhVien"),
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: false
      },
      request_data: {
        type: Sequelize.JSON
      },
      response_status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("activity_logs");
  }
};
