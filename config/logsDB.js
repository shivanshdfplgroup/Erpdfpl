const mongoose = require("mongoose");

const connectLogsDB = () => {
  try {
    mongoose.connect(process.env.LOGS_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("error", (err) => {
      console.log("err", err);
    });

    mongoose.connection.on("connected", (err, res) => {
      console.log("Logs DB Connection established");
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectLogsDB;