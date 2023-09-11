// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const ToDoList = require("../models/toDoList.schema.js");
const Logs = require("../models/log.model");
const getDate = require('../middleware/getDate.js'); // Adjust the path as needed

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * 1. create task
 * 2. update task
 * 3. get tasks
 */

const createTask = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // const token = req.headers.authorization;
      // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  
      let userId;
      if (req.body.userId) userId = req.body.userId;
      else userId = decode.id;
      const projectId = req.body.projectId;
  
      // role -> HO, admin
  
      const desc = req.body.desc;
      const name = req.body.name;
      // an array
      const assgnto = req.body.assgnto;
      const daysNeeded= req.body.daysNeeded;
      const deadline=req.body.deadline;
  
      const task = await ToDoList.create({
        taskId: uuidv4(),
        userId: userId,
        projectId: projectId,
        taskDescription: desc,
        taskName: name,
        taskAssignedTo: assgnto,
        daysNeeded: daysNeeded,
        deadline: deadline,
      });
      let message = decode.name+ " " +"created task: "+ task.taskName + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      console.log('we created',task);
      // console.log(task, getDate.getCurrentDate());
      return res.status(200).json({ code: 200, message: "task created", data: task });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 513,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error"
      });
    }
  };

  // not needed as we no longer have field taskStatus
// status is String now and we currently don't need to update it
const updateTaskStatus = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // all, user specific
      // previously
      // const taskId = req.query.taskId;
      const taskId = req.body.taskId;
      const updatedTask = await ToDoList.findOneAndUpdate(
        { taskId: taskId }, // Specify the unique identifier of the task record
        {
          taskStatus: req.body.taskStatus, // Update the taskStatus field with the provided value
        },
        {
          new: true, // Return the updated document
          select: {
            taskId: true,
            projectId: true,
            userId: true,
            taskDescription: true,
            taskName: true,
            taskStatus: true,
          },
        }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ code: 404, message: "Task not found" });
      }
      let message = decode.name+ " " +"updated status of task: "+ updatedTask.taskName + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res
        .status(200)
        .json({ code: 200, data: updatedTask, message: "Task updated" });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 514,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

// userId is id of person who assigned task we also don't need it
// we need task according to assignedTo, so we get tasks assigned to a particular user
// const getTasks = async(req, res) => {
//     try{
//         // on user basis, all
//         const userId = req.body.id;

//         const tasks = await prisma.toDoList.findMany({
//             where: {
//                 userId: userId
//             },
//             select: {
//                 taskId: true,
//                 projectId: true,
//                 userId: true,
//                 taskDescription: true,
//                 taskStatus: true
//             }
//         })

//         return res.status(200).json({code: 200, data: tasks, message: "tasks of the user retrieved"});


//     }catch(error){
//         console.log(error);
//         let message = error + " "+getDate.getCurrentDate();
//         await Logs.create({
//           logs: message
//         });
    
//         return res.status(500).json({
//           code: 500, error , message: "Internal Server Error"
//         })
//     }
// }

// same as previous function
// const getTasksOfUserProjectBasis = async(req, res) => {
//     try{

//         // all

//         const projectId = req.body.projectId
//         const userId = req.body.userId

//         const tasks = await prisma.toDoList.findMany({
//             where: {
//                 userId: userId,
//                 projectId: projectId
//             },
//             select: {
//                 taskId: true,
//                 projectId: true,
//                 userId: true,
//                 taskDescription: true,
//                 taskStatus: true
//             }
//         })
//         return res.status(200).json({code: 200, data: tasks, message: "tasks of the user of given project retrieved"})
//     }catch(error){
//         console.log(error);
//         let message = error + " "+getDate.getCurrentDate();
//         await Logs.create({
//           logs: message
//         });
    
//         return res.status(500).json({
//           code: 500, error , message: "Internal Server Error"
//         })
//     }
// }

const getAllTasksOfProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // user specific, HO
  
      const projectId = req.body.projectId;
  
      const tasks = await ToDoList.find({
        projectId: projectId
      });

      let message = decode.name+ " " +"retrieved all tasks of projectId: "+ projectId + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(200).json({ code: 200, data: tasks, message: "tasks of the project retrieved" });
  
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 515,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error"
      });
    }
  };

const getSingleTask = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try{

        // user specific, HO

        const taskId = req.body.taskId;

        const task = await ToDoList.find({
                taskId: taskId
            });
            let message = decode.name+ " " +"retrieved task: "+ task.taskName + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

        return res.status(200).json({code: 200, data: task, message: "task with particular id retrieved"});

    }catch(error){
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 516, error: "Please Contact HeadOffice" , message: "Internal Server Error"
        })
    }
}

const getAllTasksOfUser = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try{

        // all

        const specificUserId = req.body.particularUserId
        
        const tasks = await ToDoList.find({
          taskAssignedTo: { $in: [specificUserId] }, // Use $in to match if the specificUserId is present in the array
        });
        // const tasks = await ToDoList.find({
        //     taskAssignedTo: specificUserId
        //   }).select({
        //     taskId: true,
        //     projectId: true,
        //     userId: true,
        //     taskName: true,
        //     taskDescription: true,
        //     taskStatus: true,
        //     is_completed: true
        //   });
          let message = decode.name+ " " +"retrieved all his tasks"+" on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
        return res.status(200).json({code: 200, data: tasks, message: "all tasks of a specific user retrieved"})
    }catch(error){
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 517, error: "Please Contact HeadOffice" , message: "Internal Server Error"
        })
    }
}

// on completion of task
const updateTaskCompletion = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // all, user specific
      const specificTaskId = req.body.particularTaskId;
      
      const updatedTask = await ToDoList.findOneAndUpdate(
        { taskId: specificTaskId },
        {
          $push: { hasCompleted: req.body.userId }, // Add the userId to hasCompleted array
        },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ code: 404, message: "Task not found" });
      }

      // Check if hasCompleted size is equal to taskAssignedTo size
    if (updatedTask.hasCompleted.length === updatedTask.taskAssignedTo.length) {
      updatedTask.is_completed = true;
      updatedTask.completedAt = new Date();
      await updatedTask.save();
    }
      let message = decode.name+ " " +"completed Task: "+ updatedTask.taskName + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, data: updatedTask, message: "Task completed" });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 518,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

// on completion of task
const updateTaskUpdate = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // update suggestion for a specific task by a specific user
      console.log(req.body);
      const specificTaskId = req.body.particularTaskId;
      const specificUpdate = req.body.update;
      const userId = req.body.userId;
      // console.log('then', specificTaskId, specificUpdate);
      const updatedTask = await ToDoList.findOneAndUpdate(
        { taskId: specificTaskId },
        {
          $push: { 
            taskUpdate: { userId, update: specificUpdate },
          },
        },
        {
          new: true,
          select: {
            taskName: true,
            taskId: true,
            projectId: true,
            userId: true,
            taskDescription: true,
            taskStatus: true,
            is_completed: true,
            completedAt: true,
            taskUpdate: true,
          },
        }
      );
      // const updatedTask = await ToDoList.findOneAndUpdate(
      //   { taskId: specificTaskId }, // Specify the unique identifier of the task record
      //   {
      //     taskUpdate: specificUpdate,
      //   },
      //   {
      //     new: true, // Return the updated document
      //     select: {
      //       taskName: true,
      //       taskId: true,
      //       projectId: true,
      //       userId: true,
      //       taskDescription: true,
      //       taskStatus: true,
      //       is_completed: true,
      //       completedAt: true,
      //       taskUpdate: true,
      //     },
      //   }
      // );
      // const updatedTask = {
      //   name: "sucess",
      //   age: 1
      // };
  
      if (!updatedTask) {
        return res.status(404).json({ code: 404, message: "Task not found" });
      }
      let message = decode.name+ " " +"gave update for task: "+ updatedTask.taskName + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, data: updatedTask, message: "Task updated" });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 519,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  

module.exports = {
    createTask,
    updateTaskStatus,
    getAllTasksOfProject,
    getSingleTask,
    getAllTasksOfUser,
    updateTaskCompletion,
    updateTaskUpdate
}