const express = require('express');
const dotenv = require('dotenv');
const connectLogsDB = require('./config/logsDB');
const routes = require('./routes/index')
const vendorRoutes = require('./routes/vendorRoute')
const nonMiddlewareRoutes = require('./routes/index2');
const path=require('path')
// import { Pool } from "pg";
const cors = require('cors')
const app = express();
dotenv.config();

const auth = require("./middleware/auth");
const { generatingCode } = require('./MongoFunctions/mongoVendorAdd');
const { upload } = require('./MongoFunctions/multer_util');

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174','http://192.168.43.71:5173','http://127.0.0.1:5173',"http://192.168.1.6:5173"], // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'], // Allowed HTTP methods
  credentials: true,

}));
// app.use(cors())
app.use(express.static(path.join(__dirname,'dist')))

connectLogsDB()

app.get("/test", (req,res, next) => {
  res.send("hi"); 
});
console.log(__dirname)

app.use('/api/v1' , nonMiddlewareRoutes);
app.use('/api/v1' ,auth,  routes);
app.use('/api/v1' ,auth,  vendorRoutes);

// app.use("*", function(req, res ){
// 	res.sendFile(path.join(__dirname,'dist/index.html'))
// })
app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});

app.use((req, res) => {
  res.status(404).json({
    name: "ERP carbyne assignment RESTful API",
    message: "NOT FOUND"
  });
});