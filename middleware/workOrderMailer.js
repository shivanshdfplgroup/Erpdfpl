

const { default: axios } = require("axios");
const { PrismaClient } = require("@prisma/client");
const Logs = require("../models/log.model");
const nodemailer = require ("nodemailer");
const WorkOrder = require("../models/workorder.schema");
const env = require("dotenv")
const workOrderMail = async (req, res) => {
    const workOrder = await WorkOrder.findOne({
        workOrderId: req.body.workOrderId,
        amend:req.body.amend?req.body.amend:0
    });
        
    try {
        const response = await axios.get(workOrder.pdfOfWorkOrder, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data, 'binary');
        console.log('PDF fetched and converted to buffer successfully');

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const message = {
            from: process.env.EMAIL_ID,
            to: workOrder.emailId,
            subject: "Your Work Order",
            text: 'Here is the attached PDF Of Work Order.',
            attachments: [
                {
                    filename: 'WorkOrder.pdf',
                    content: pdfBuffer,
                },
            ],
        };

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(422).json({ error: error.message, message: "Some Error Occurred" });
            }
            console.log("Message sent: %s", info.messageId);
            console.log("Email sent:", info.response);
            res.status(200).json({ message: "Email sent successfully" });
        });
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).json({ error: 'Error fetching PDF' });
    }
};

module.exports = {
    workOrderMail
};
