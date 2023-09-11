

const { default: axios } = require("axios");
const { PrismaClient } = require("@prisma/client");
const Logs = require("../models/log.model");
const nodemailer = require ("nodemailer");
const env = require("dotenv");
const PurchaseOrder = require("../models/purchaseOrder.schema");
const purchaseOrderMail = async (req, res) => {
    console.log(req.body.poId)
    const purchaseOrder = await PurchaseOrder.findOne({
        poId: req.body.poId,
    });


        
    try {
        const response = await axios.get(purchaseOrder.pdfOfPurchaseOrder, { responseType: 'arraybuffer' });
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
            to: purchaseOrder.contactPersonEmail,
            subject: "Your Purchase Order",
            text: 'Here is the attached PDF Of Purchase Order.',
            attachments: [
                {
                    filename: 'Purchase.pdf',
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
    purchaseOrderMail
};
