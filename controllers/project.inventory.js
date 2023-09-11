// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

const Project = require("../models/project.schema.js");
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model.js");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const ProjectStock = require("../models/projectstock.schema.js");

const getItemsForProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    /**
     * 1. Check if assigned to project, using projectId taken from req.body, if yes allow to add
     * 2. Create id, add name, add desc, add projectId, projectName, companyName
     * 3. Log it
     */
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log("Ghet Items, Project Wise",req.body)

    const projectId = req.body.projectId;
    const project = await ProjectStock.find({ projectId: projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found", code: 404 });
    }

    const items = await ProjectStock.find({
      projectId: projectId,
      is_deleted: false,
    });


    let message = decode.name+ " wants Stock Project Wise Show for projectId: " + req.body.projectId+ " on "+getDate.getCurrentDate();

    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res.status(200).json({
      code: 200,
      message: "Items Shown",
      data: items,
      userId: req.body.userId,
    });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res.status(500).json({ code: 413, message: message, error: "Please Contact HeadOffice" });
  }
};

module.exports = {
  getItemsForProject
};
