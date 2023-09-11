const { default: mongoose } = require("mongoose");
const { Location, Block, GP, Store } = require("../Schemas/locationSchema");
const Project = require("../models/project.schema");

async function addLocation(req, res) {
  try {
    const existing = await Location.findOne({ name: req.body.locationName });
    if (existing) {
      throw new Error("A Location with the same name already exists.");
    }

    const location = new Location({ name: req.body.locationName });
    const savedLocation = await location.save();

    return res.status(200).json({ message: "Added Location", data: savedLocation });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function addBlock(req, res) {
  try {
    console.log(req.body)
  

    const block = new Block({ name: req.body.blockName });
    const savedBlock = await block.save();

console.log(  req.body.locationId)

    const location = await Location.findByIdAndUpdate(
      req.body.locationId,
      { $push: { blocks: savedBlock._id } },
    );
    console.log(location)


    return res
      .status(200)
      .json({ message: "Added Block and Updated Location", data: savedBlock });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function addGP(req, res) {
  try {
    const existing = await GP.findOne({ name: req.body.gpName });
    if (existing) {
      throw new Error("A gp with the same name already exists.");
    }

    const gp = new GP({ name: req.body.gpName });
    const savedGp = await gp.save();

    const block = await Block.findByIdAndUpdate(
      req.body.blockId,
      { $push: { gps: savedGp._id } },
      { new: true }
    );

    return res.status(200).json({ message: "Added GP", data: savedGp });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function addStore(req, res) {
  try {
    const existing = await Store.findOne({ name: req.body.storeName });
    if (existing) {
      throw new Error("A Store with the same name already exists.");
    }

    const store = new Store({ name: req.body.storeName });
    const savedStore = await store.save();

    const gp = await GP.findByIdAndUpdate(
      req.body.gpId,
      { $push: { stores: savedStore._id } },
      { new: true }
    );

    return res.status(200).json({ message: "Added Store", data: savedStore });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getAllLocation(req, res) {
  try {
    const locations = await Location.find();
    return res.status(200).json({ message: "All Location", data: locations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getBlockOfLocation(req, res) {
  try {
    const blocks = await Location.findById(req.body.locationId).populate({
      path: "blocks",
      model: "Block",
    });
    return res
      .status(200)
      .json({ message: "Blocks of Location", data: blocks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getBlockOfLocationByGpId(req, res) {
  try {
    const block = await Block.findOne({ gps: { $in: [new mongoose.Types.ObjectId(req.body.gpId)] } });
    console.log(block)
    if (!block) {
      return res.status(400).json({ message: "Error", error: "Block Not Found" });
      
    }
    return res
      .status(200)
      .json({ message: "Blocks of GP", data: block.name });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getGpsOfBlock(req, res) {
  try {
    const gps = await Block.findById(req.body.blockId).populate({
      path: "gps",
      model: "GP",
    });
    return res.status(200).json({ message: "GPs of Block", data: gps });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getAllGpsOfProject(req, res) {
  try {
    let project = await Project.findOne({name:req.body.locationName})
let locationName = ""
if(project){
  locationName = project.locationName
}
else{
  locationName = req.body.locationName
}
      const location = await Location.findOne({ name: locationName }).populate({
          path: 'blocks',
          populate: {
              path: 'gps',
              model: 'GP',
          }
      });

      if (!location) {
          throw new Error('Location not found');
      }

      const allGPs = [];

      // Iterate through blocks and GPS to gather all GPs
      location.blocks.forEach(block => {
          allGPs.push(...block.gps);
      });

      return res.status(200).json({ message: "GPs of Location", data: allGPs });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}



async function getStoresOfGp(req, res) {
  try {
    const stores = await GP.findById(req.body.gpId).populate({
      path: "stores",
      model: "Store",
    });
    return res.status(200).json({ message: "Stores of Gp", data: stores });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getAllLocationWithAllDetails(req, res) {
  try {
    const locations = await Location.find().populate({
      path: "blocks",
      model: "Block",
      populate: {
        path: "gps",
        model: "GP",
        populate: {
          path: "stores",
          model: "Store",
        },
      },
    });

    return res
      .status(200)
      .json({ message: "All Location with Details", data: locations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

// async function deleteAllDataLocation(req, res) {
//   console.log("here vedat")
//   try {
//     await Location.collection.drop();

//     // Delete the GPs collection
//     await GP.collection.drop();

//     // Delete the blocks collection
//     await Block.collection.drop();
    
//     // Delete the stores collection
//     await Store.collection.drop();

//     return res.status(200).json({ message: "All Categories, Subcategories, and Products have been deleted." });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(400).json({ message: "Error", error: error.message });
//   }
// }

module.exports = {
  addLocation,
  addBlock,
  addGP,
  addStore,
  getAllLocation,
  getBlockOfLocation,
  getGpsOfBlock,
  getAllLocationWithAllDetails,
  getStoresOfGp,
  getAllGpsOfProject,
  getBlockOfLocationByGpId
  // deleteAllDataLocation
}