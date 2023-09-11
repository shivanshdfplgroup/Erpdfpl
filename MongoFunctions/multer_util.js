const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");

// Set up Cloudinary storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body)
    const vendorName = req.body.vendorName; // Assuming the student's name is sent in the request body
    // console.log();
    // Create a directory with the student's name inside the uploads folder
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    const dynamicFolderPath = path.join(uploadsDir, `${vendorName}`);
    if (!fs.existsSync(dynamicFolderPath)) {
      fs.mkdirSync(dynamicFolderPath);
    }
    cb(null, dynamicFolderPath); // specify the directory to save the files
  },
  filename: (req, file, cb) => {
    // Use a timestamped filename to prevent duplicates
    // console.log(file);
    // const timestamp = Date.now().toString();
    try {
      const ext = file.originalname.split(".").pop();
      cb(null, file.fieldname + "." + ext);
    } catch (error) {
      console.log(error);
    }
  },
});
let upload;
module.exports.upload = multer({ storage: storage });
