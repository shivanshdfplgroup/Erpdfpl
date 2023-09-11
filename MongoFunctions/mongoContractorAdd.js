const Contractor = require("../Schemas/contractorSchema");
const Vendor = require("../Schemas/vendorSchema");

async function generatingContractorCode (req, res) {
console.log(req.files)
  try {
    for (const fieldName in req.files) {
      const file = req.files[fieldName][0];
      console.log(file)
      req.body[file.fieldname] = decodeURIComponent(`https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${file.key}`);
      req.body[file.etag] = file.etag;
    }

    const data = {
      name: req.body.contractorName,
      category: req.body.category,
      project: req.body.projectName,
    };

    // Making project snippet like water project ==== wp
    let words = data.project.split(" ");
    let project_SH = "";
    for (let i = 0; i < words.length; i++) {project_SH += words[i].charAt(0);}
    project_SH = project_SH.toUpperCase();

    const codePrefix = `${project_SH}-${data.category.charAt(0)}${data.category.charAt(1).toUpperCase()}-`;

    const codeCount = (await Contractor.countDocuments()) + (await Vendor.countDocuments()) + 1;
    const code = `${codePrefix}${codeCount.toString().padStart(3, "0")}`;
    data.contractor_code = code;
    req.body.contractor_code = code;
   
    req.body.authorizedContactPerson=JSON.parse( req.body.authorizedContactPerson)
    req.body.projectDetails=JSON.parse( req.body.projectDetails)
    
    console.log(req.body);
    let ans = await Contractor.create(req.body);
    console.log(ans)


    return res.status(200).json({ msg: true });

  } catch (error) {
    return res.status(400).json({ error: error });
  }
};


async function getAllContractors (req, res) {
  try {
    let contractors = await Contractor.find();
    console.log(contractors)
    return res.status(200).json({ msg: true, data: contractors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};

async function getAllContractorsProjectWise (req, res) {
  try {
    let vendors = await Contractor.find({projectsAssigned:{$in:req.body.projectId}});
    // console.log(vendors)
    return res.status(200).json({ msg: true, data: vendors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};

async function getContractorById (req, res) {
  try {
    let contractors = await Contractor.findById(req.body.contractorId);
    console.log(contractors)
    return res.status(200).json({ message: true, data: contractors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};


async function deleteContractor (req, res) {
  try {
    console.log(req.body.contractorId, "her")
    let contractors = await Contractor.findByIdAndDelete(req.body.contractorId);
    
    return res.status(200).json({ message: "Respective contractor Has Been Deleted", data: contractors });
  } catch (error) {
    return res.status(400).json({ message: error, error: error });
  }
};


module.exports={
  getAllContractors,generatingContractorCode, deleteContractor, getContractorById,
  getAllContractorsProjectWise
}
