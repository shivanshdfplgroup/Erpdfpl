const mongoose = require('mongoose');


const toDoListSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  userId: String,// id of person who assigned the task
  projectId: String,
  taskDescription: String,
  taskName: String,
  taskAssignedTo: [{ type: String }],
  deadline: Date, // Deadline date for the task
  daysNeeded: Number, // Days needed to complete the task
  // limit: Number,
  // taskStatus: String,
  // instead of taskSuggestion use taskUpdate
  // taskUpdate: String,
  // Remember taskStatus id string with values like "upcoming", "current" and "delayed"
  // taskStatus: { type: Boolean, default: false },
  hasCompleted: [{ type: String }],// will consist of userId's of users who completed their part
  taskUpdate: [{ userId: String, update: String }], // Array of updates by users
  is_deleted: { type: Boolean, default: false },
  is_completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date,
});



const ToDoList = mongoose.model('ToDoList', toDoListSchema);

module.exports = ToDoList;