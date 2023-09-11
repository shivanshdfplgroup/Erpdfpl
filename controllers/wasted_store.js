const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createStoreItem = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token = req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    if (decode.role !== "Admin")
      return res.status(400).json({ code: 302,message: "You Are Not Admin" });

    const task = await prisma.itemProduct.create({
      data: {
        id: uuidv4(),
        userId: decode.id,

        category: req.body.categoryId,
        subcategory: req.body.subcategoryId,
        subsubcategory: req.body.subsubcategoryId,
        product: req.body.product,
        unit: req.body.unit,
        productCode: req.body.productCode,
      },
    });
    console.log(task);
    return res
      .status(200)
      .json({ code: 200, message: "Product created", data: task });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 520,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const createCategory = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token = req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    const category = await prisma.category.create({
      data: {
        id: uuidv4(),
        userId: decode.id,
        name: req.body.category,
      },
    });
    let message = `${decode.name} created Category ${
      req.body.category
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    console.log(category);
    return res
      .status(200)
      .json({ code: 200, message: "Category Created", data: category });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 521,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
const createSubCategory = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token = req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    const category = await prisma.subcategory.create({
      data: {
        id: uuidv4(),
        userId: decode.id,
        name: req.body.subcategory,
        category: {
          connect: { id: req.body.categoryId },
        },
      },
    });
    let message = `${decode.name} created Sub Category ${
      req.body.subcategory
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "Sub Category Created", data: category });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 522,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
const createSubSubCategory = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token = req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log(req.body);

    const category = await prisma.subsubcategory.create({
      data: {
        id: uuidv4(),
        userId: decode.id,
        name: req.body.subsubcategory,
        subcategory: {
          connect: { id: req.body.subcategoryId },
        },
      },
    });
    let message = `${decode.name} created Sub Sub Category ${
      req.body.subsubcategory
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "Sub Sub Category Created", data: category });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 523,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
const getCategory = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token = req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            subsubcategories: true,
          },
        },
      },
    });

    let message = `${decode.name} wants all Category ${
      req.body.categories
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "Category Fetched", data: categories });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 524,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
const getStoreItem = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token = req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    const task = await prisma.itemProduct.findMany({
      select: {
        id: true,
        category: true,
        subcategory: true,
        subsubcategory: true,
        product: true,
        unit: true,
        productCode:true
      },
    });
    // Fetch category names
    const categoryIds = task.map((task) => task.category);
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Fetch subcategory names

    const subcategoryIds = task.map((task) => task.subcategory);
    const subcategories = await prisma.subcategory.findMany({
      where: {
        id: {
          in: subcategoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Fetch subsubcategory names
    const subsubcategoryIds = task.map((task) => task.subsubcategory);
    const subsubcategories = await prisma.subsubcategory.findMany({
      where: {
        id: {
          in: subsubcategoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Merge the names into the tasks
    const tasksWithNames = task.map((task) => {
      const category = categories.find(
        (category) => category.id === task.category
      );
      const subcategory = subcategories.find(
        (subcategory) => subcategory.id === task.subcategory
      );
      const subsubcategory = subsubcategories.find(
        (subsubcategory) => subsubcategory.id === task.subsubcategory
      );

      return {
        id: task.id,
        category: category ? category.name : null,
        subcategory: subcategory ? subcategory.name : null,
        subsubcategory: subsubcategory ? subsubcategory.name : null,
        product: task.product,
        unit: task.unit,
        productCode:task.productCode
      };
    });

    let message = `Products Retrieved by ${decode.name}`;
        await Logs.create({
            logs: message,
            userId: req.body.userId,
        })

    return res
      .status(200)
      .json({
        code: 200,
        message: `Product Show to ${decode.role}`,
        data: tasksWithNames,
      });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 525,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const deleteStoreItem = async( req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{
      /**
       * 1. get inventoryId from query
       * 2. update its isDeleted flag to true
       * 3. log it
       * 4. return
       */
      const subcategories = await prisma.itemProduct.delete({
        where: {
          id: req.body.productId,
        }, });
        let message = `Product Deleted by ${decode.name}`;
        await Logs.create({
            logs: message,
            userId: req.body.userId,
        })
        return res.status(200).json({ code : 200, message: "Product Deleted", data: subcategories})
  }catch(error){
      console.log(error);
      let message = `Internal Server Error`;
      let entry = decode.name+" "+error+ " "+getDate.getCurrentDate();
      await Logs.create({
          logs: entry,
          userId: req.body.userId,
      })
      return res.status(500).json({ code : 526, message: message, error: "Please Contact HeadOffice"})
  }
}
// const deleteAllCat = async( req, res) => {
//   try{
//       /**
//        * 1. get inventoryId from query
//        * 2. update its isDeleted flag to true
//        * 3. log it
//        * 4. return
//       */
//       const subcastegories = await prisma.subsubcategory.deleteMany({})
//       const susbcategories = await prisma.subcategory.deleteMany({})
//       const subcsategories = await prisma.category.deleteMany({})
//         return res.status(200).json({ code : 200, message: "Product Deleted"})
//   }catch(error){
//       console.log(error);
//       let message = `Internal Server Error`;
//       await Logs.create({
//           logs: error
//       })
//       return res.status(500).json({ code : 500, message: message, error: error})
//   }
// }


module.exports = {
  createStoreItem,
  createCategory,
  createSubCategory,
  createSubSubCategory,
  getCategory,
  getStoreItem,
  deleteStoreItem,
};


