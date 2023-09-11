const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_CODE_KEY,
  },
});

const downloadFromS3 = async(req, res) => {

  const { filename } = req.body.filename;
  
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    });
  
    const response = await s3Client.send(command);
    const fileStream = response.Body;
  
    res.attachment(filename);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }

}

module.exports = {
  downloadFromS3
}