// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

const Project = require("../models/project.schema.js");
const Inventory = require("../models/inventory.schema.js");
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const ProjectStock = require("../models/projectstock.schema.js");

const createItem = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    /**
     * 1. Check if assigned to project, using projectId taken from req.body, if yes allow to add
     * 2. Create id, add name, add desc, add projectId, projectName, companyName
     * 3. Log it
     */

    const projectId = req.body.projectId;
    const project = await Project.findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found", code: 404 });
    }

    const projectName = req.body.projectName;
    const companyName = "Carbyne"; // Assuming it's constant for all items

    const tableData = req.body.tableData;

    let inventory = [];
    const saveItems = async (data, projectId, projectName, companyName) => {
      for (const item of data) {
        let materialCode = `${item.materialCategory}/${item.materialSubCategory}/${item.materialDescription}`;

        const findInventory = await Inventory.findOne({
          materialCode: materialCode,
          projectId: projectId,
        });

        if (findInventory) {
          throw new Error(`${item.materialCategory} is already exists`);
        }
        // *******************************************IMP: please get a modal "IdGeneration" and import in the file
        // const sequenceVal = await IdGeneration.countDocuments();
        const sequenceVal = await Inventory.countDocuments();
        const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
        const uniqueId = `Item/${paddedSequenceVal}`;
        // const sequenceVal = 777;
        // const paddedSequenceVal = String(sequenceVal + 1).padStart(5, '0');
        // const uniqueId = `Item/${paddedSequenceVal}`;
    
        // Create a new document in the 'idGeneration' collection
        // await IdGeneration.create({ uniqueId });
    
        // itemId will now hold the generated uniqueId
        const itemId = uniqueId;

        try {
          await Inventory.create({
            id: itemId,
            projectId: projectId,
            projectName: projectName,
            companyName: companyName,
            materialCategory: item.materialCategory,
            materialSubCategory: item.materialSubCategory,
            materialDescription: item.materialDescription,
            units: parseInt(item.quantity),
            uom: item.uom,
          });
          console.log(`Item with ID ${itemId} saved successfully.`);
          inventory.push({ ItemId: itemId, materialDescription: item.materialDescription });
        } catch (error) {
          console.error(`Error saving item with ID ${itemId}:`, error);
        }
      }
    };

    await saveItems(tableData, projectId, projectName, companyName);

    let message = decode.name+ " " +"Item created at TS: for project "+projectName + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({
      code: 200,
      message: "Items created",
      data: inventory,
    });
  } catch (error) {
    console.log(error);
    let message = "Internal Server Error";
    let entry = decode.name + " " + error + " " + getDate.getCurrentDate();
    await Logs.create({
      logs: entry,
      userId: req.body.userId,
    });
    return res.status(500).json({ code: 413, message: message, error: "Please Contact HeadOffice" });
  }
};

const readItem = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    /**
     * 1. Get inventoryId from query
     * 2. Check if not deleted
     * 3. Send data if not deleted, otherwise say deleted
     * 4. Log it
     */

    // -> storeManager, PM, DPM, -> logs => HO

    const inventoryId = req.query.inventoryId;
    const item = await Inventory.findOne({ id: inventoryId });

    if (!item) {
      let message = "Item requested not found";
      return res.status(404).json({ code: 404, message: message });
    }

    if (item.is_deleted) {
      let message = "Item requested is deleted";
      return res.status(401).json({ code: 301, message: message });
    }

    let message = `Item with ${inventoryId} has been read by the user ${decode.name}`;
    await Logs.create({
      logs: message+" "+getDate.getCurrentDate(),
      userId: req.body.userId,
    });

    return res.status(200).json({ code: 200, message: message, data: item });
  } catch (error) {
    console.log(error);
    let message = `Internal Server Error`;
    let entry = decode.name + " " + error + " " + getDate.getCurrentDate();
    await Logs.create({
      logs: entry,
      userId: req.body.userId,
    });
    return res.status(500).json({ code: 414, message: message, error: "Please Contact HeadOffice" });
  }
};

const readAllItems = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    /**
     * 1. Get projectId from query
     * 2. Search all the inventory of the project which have not deleted flag false, push it in an array
     * 3. Send data of the inventory back to the client
     * 4. Log it
     */

    // this basically gives you the whole inventory

    // const projectId = req.query.projectId
    console.log(req.body.projectId, "Item");
    const projectId = req.body.projectId;
    const gpId = req.body.gpId;
    // const projectId = req.body.id

    const items = await Inventory.find({
      projectId: projectId,
      gpId: gpId,
      is_deleted: false,
    });

    console.log(items, "items");
    let message = `All Items with projectId: ${projectId} and gpId: ${gpId} has been read by the user ${decode.name}`;
    await Logs.create({
      logs: message+" "+getDate.getCurrentDate(),
      userId: req.body.userId,
    });

    return res.status(200).json({
      code: 200,
      data: items,
    });
  } catch (error) {
    console.log(error);
    let message = `Internal Server Error`;
    let entry = decode.name + " " + error + " " + getDate.getCurrentDate();
    await Logs.create({
      logs: entry,
      userId: req.body.userId,
    });
    return res.status(500).json({ code: 415, message: message, error: error });
  }
};

const updateItem = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const projectId = req.body.projectId;
    const gpName = req.body.gpName;
    const tableData = req.body.tableValue;
    console.log(req.body);

    async function updateInventoryItem(stockId, itemId, quantityIssued) {
      const inventoryItem = await Inventory.findOne({ _id: itemId });
      const stockItem = await ProjectStock.findOne({ _id: stockId });
      if (!inventoryItem) {
        throw new Error(`Inventory item with ID ${itemId} not found.`);
      }
      
      if(stockItem.units < stockItem.dispatchedQty+parseInt(quantityIssued))
      {
        throw new Error(`Stock Inventory Does Not Have That Product In That Quantity`);
      }
      const dispatchedUnits = stockItem.dispatchedQty + parseInt(quantityIssued);
      
      if(inventoryItem.boqQty < inventoryItem.recievedQty + parseInt(quantityIssued))
      {
        throw new Error(`Inventory Does Not Exceed Its Boq Quantity`);
      }
      const newUnits = inventoryItem.recievedQty + parseInt(quantityIssued);


      const updatedItem = await Inventory.findOneAndUpdate(
        { _id: itemId },
        {$set:{ recievedQty: parseInt(newUnits)} },
        { new: true }
      );
      return updatedItem;
    }

    const initialUnitsArr = [];
    for (const itemData of tableData) {
      const inventoryItem = await Inventory.findOne({
        projectId: projectId,
        materialCategory: itemData.materialCategory,
        materialSubCategory: itemData.materialSubCategory,
        materialDescription: itemData.materialDescription,
      });

      if (!inventoryItem) {
        throw new Error(
          `Inventory item not found for table data: ${JSON.stringify(itemData)}`
        );
      }

      initialUnitsArr.push({
        id: inventoryItem.id,
        units: inventoryItem.units,
      });
    }

    const updatedItems = [];
    let hasError = false; // Flag to track if an error occurred during updates

    for (let i = 0; i < tableData.length; i++) {
      const itemData = tableData[i];
      const inventoryItem = await Inventory.findOne({
        projectId: projectId,
        gpName:gpName,
        materialCategory: itemData.materialCategory,
        materialSubCategory: itemData.materialSubCategory,
        materialDescription: itemData.materialDescription,
      });

      const projectStock = await ProjectStock.findOne({
        projectId: projectId,
        materialCategory: itemData.materialCategory,
        materialSubCategory: itemData.materialSubCategory,
        materialDescription: itemData.materialDescription,
      })

      if(!projectStock)
      {
        throw new Error(`Project Inventory Does Not Have That Product In Inventory`);
      }

      try {
        console.log(projectStock, inventoryItem)
        const updatedItem = await updateInventoryItem(
          projectStock._id,
          inventoryItem._id,
          itemData.quantity_issued
        );
        console.log(`Inventory item ${inventoryItem.materialCategory+inventoryItem.materialSubCategory+inventoryItem.materialDescription} updated successfully.`);
        updatedItems.push(updatedItem);
      } catch (error) {
        console.error(error.message);
        hasError = true; // Set the flag to true if an error occurs
        break; // Break out of the loop as we don't need to process further updates
      }
    }

    if (hasError) {
      // Rollback: Restore initial units for all items
      for (const { id, units } of initialUnitsArr) {
        await Inventory.findOneAndUpdate({ id }, { units }, { new: true });
      }
      return res
        .status(500)
        .json({
          code: 416,
          message:
            "An error occurred during updates. Or Any Material is Not Available in Inventory Stock.",
        });
    }

    let message = `All inventory items updated successfully by ${decode.name}.`+ +" "+getDate.getCurrentDate();
    await Logs.create({ logs: message, userId: req.body.userId, });

    return res
      .status(200)
      .json({
        code: 200,
        message: "Inventory items updated successfully.",
        data: updatedItems,
      });
  } catch (error) {
    console.log(error);
    let message = `Internal Server Error`+" "+getDate.getCurrentDate();
    let entry = decode.name + " " + error + " " + getDate.getCurrentDate();
    await Logs.create({ logs: entry, userId: req.body.userId, });
    return res.status(500).json({ code: 416, message: message, error: "Please Contact HeadOffice" });
  }
};


const deleteItem = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    /**
     * 1. get inventoryId from query
     * 2. update its isDeleted flag to true
     * 3. log it
     * 4. return
     */
    const inventoryId = req.query.inventoryId;
    const item = await Inventory.findOne({ id: inventoryId });

    if (!item) {
      let message = "Item requested not found";
      return res.status(404).json({ code: 404, message: message });
    }

    if (item.is_deleted) {
      let message = "Item is already deleted";
      return res.status(401).json({ code: 301, message: message });
    }
    
    const deletedItem = await Inventory.findOneAndUpdate(
      { id: item.id },
      { is_deleted: true },
      { new: true }
    );

    let message = `Item with ${inventoryId} has been deleted by the user ${decode.name}`;
    await Logs.create({
      logs: message+" "+getDate.getCurrentDate(),
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({
        code: 200,
        message: "Inventory item deleted successfully.",
        data: deletedItem,
      });
  } catch (error) {
    console.log(error);
    let message = `Internal Server Error`;
    let entry = decode.name + " " + error + " " + getDate.getCurrentDate();
    await Logs.create({
      logs: entry,
      userId: req.body.userId,
    });
    return res.status(500).json({ code: 417, message: message, error: "Please Contact HeadOffice" });
  }
};

module.exports = {
  createItem,
  readItem,
  readAllItems,
  updateItem,
  deleteItem,
};
