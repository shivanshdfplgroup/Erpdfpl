const Vendor = require("../Schemas/vendorSchema");

async function generatingVendorCode (req, res) {
console.log(req.files)
  try {
    for (const fieldName in req.files) {
      const file = req.files[fieldName][0];
      console.log(file)
      req.body[file.fieldname] = decodeURIComponent(`https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${file.key}`);
      req.body[file.etag] = file.etag;
    }

    const data = {
      name: req.body.vendorName,
      category: req.body.category,
      project: req.body.projectName,
    };

    // Making project snippet like water project ==== wp
    let words = data.project.split(" ");
    let project_SH = "";
    for (let i = 0; i < words.length; i++) {project_SH += words[i].charAt(0);}
    project_SH = project_SH.toUpperCase();

    const codePrefix = `${project_SH}-${data.category.charAt(0)}${data.category.charAt(1).toUpperCase()}-`;

    const codeCount = (await Vendor.countDocuments()) + 1;
    const code = `${codePrefix}${codeCount.toString().padStart(3, "0")}`;
    data.vendor_code = code;
    req.body.vendor_code = code;
   
    req.body.authorizedContactPerson=JSON.parse( req.body.authorizedContactPerson)
    req.body.projectDetails=JSON.parse( req.body.projectDetails)
    
    console.log(req.body);
    let ans = await Vendor.create(req.body);
    console.log(ans)


    return res.status(200).json({ msg: true });

  } catch (error) {
    return res.status(400).json({ error: error });
  }
};


async function getAllVendors (req, res) {
  try {
    let vendors = await Vendor.find();
    // console.log(vendors)
    return res.status(200).json({ msg: true, data: vendors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};

async function getAllVendorsProjectWise (req, res) {
  try {
    console.log(req.body.projectId)
    let vendors = await Vendor.find({projectsAssigned:{$in:req.body.projectId}});
    // console.log(vendors)
    return res.status(200).json({ msg: true, data: vendors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};

async function getVendorById (req, res) {
  try {
    let vendors = await Vendor.findById(req.body.vendorId);
    console.log(vendors)
    return res.status(200).json({ message: true, data: vendors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};


async function deleteVendor (req, res) {
  try {
    console.log(req.body.vendorId, "her")
    let vendors = await Vendor.findByIdAndDelete(req.body.vendorId);
    let message = req.body.userId + Date.now() + 'vendors' +`${vendors}`;
    await Logs.create({
      logs: message
    });
    return res.status(200).json({ message: "Respective Vendor Has Been Deleted", data: vendors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};


module.exports={
  getAllVendors,generatingVendorCode, deleteVendor, getVendorById,
  getAllVendorsProjectWise
}
