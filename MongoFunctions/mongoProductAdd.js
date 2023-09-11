const { Category, Subcategory, Product } = require("../Schemas/ProductSchema.js");

async function addCategory(req, res) {
  try {
    const existing = await Category.findOne({ name: req.body.categoryName });
    if (existing) {
      throw new Error("A Category with the same name already exists.");
    }

    const category = new Category({ name: req.body.categoryName });
    const savedCategory = await category.save();

    return res.status(200).json({ message: "Added Category", data: savedCategory });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

// delete Category
async function deleteCategory(req, res) {
  try {
    // console.log(req.body);
    let categoryId = req.body.categoryId;


    // Find the category by its ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    // console.log('one', category);

    // Delete the associated subcategories first
    for (const subcategoryId of category.subcategories) {
      // console.log('came', subcategoryId);
      await Subcategory.findByIdAndDelete(subcategoryId);
    }
    // Delete the products associated with the category
    await Product.deleteMany({ category: categoryId });

    // Now delete the category itself
    let datacategory = await Category.findByIdAndDelete(categoryId);
    // let datacategory={val: "success"};
    return res.status(200).json({ message: "Category and its related data deleted", data: datacategory });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error", error: error.message });
  }
}


async function addSubCategory(req, res) {
  try {
    const existing = await Subcategory.findOne({ name: req.body.subcategoryName });
    if (existing) {
      throw new Error("A Subcategory with the same name already exists.");
    }

    const subcategory = new Subcategory({ name: req.body.subcategoryName });
    const savedSubCategory = await subcategory.save();

    const category = await Category.findByIdAndUpdate(
      req.body.categoryId,
      { $push: { subcategories: savedSubCategory._id } },
      { new: true }
    );
    console.log(savedSubCategory)

    return res.status(200).json({ message: "Added Sub Category", data: savedSubCategory });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

// delete Subcategory
async function deleteSubCategory(req, res) {
  try {
    const categoryId = req.body.categoryId;
    const subcategoryId = req.body.subcategoryId;

    // Find the subcategory by name
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found", data: req.body });
    }

    // Remove the subcategory reference from the associated category
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $pull: { subcategories: subcategoryId } },
      { new: true }
    );
    // Delete the products associated with the subcategory
    await Product.deleteMany({ subcategory: subcategoryId });

    let dataSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);
    return res.status(200).json({ message: "SubCategory and its related data deleted", data: dataSubcategory });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error", error: error.message, data: req.body });
  }
}

async function addProduct(req, res) {
  try {
     
    const category = await Category.findById(req.body.categoryId)
    const subCategory = await Subcategory.findById(req.body.subCategoryId)



    let code = `${category.name}/${subCategory.name}/${req.body.productDesc}`
    console.log(code)
    

    const findAlready = await Product.findOne({
      productCode:code
    })

    if(findAlready)  return res.status(400).json({ message: "Material Already Exists In Database" });
       

    const product = new Product({
      productCode:code,
      uom:req.body.uom,
      name: req.body.productDesc,
      category: req.body.categoryId,
      subcategory: req.body.subCategoryId,
    });

    const savedProduct = await product.save();

    return res.status(200).json({ message: "Added Product", data: savedProduct });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

// deleteProduct
async function deleteProduct(req, res) {
  try {
    console.log(req.body);
    // Find the product by its IDvand delete it
    let product = await Product.findByIdAndDelete(req.body.productId);
    return res.status(200).json({ message: "Product deleted", data: product });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error", error: error.message });
  }
}

async function getCategory(req, res) {
  try {
    const allCategory = await Category.find();
    // console.log(allCategory)
    return res.status(200).json({ message: "All Category", data: allCategory });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getSubCategory(req, res) {
  try {
    const allSubCategory = await Category.findById(req.body.categoryId).populate("subcategories");
    return res.status(200).json({ message: "All Sub Category", data: allSubCategory });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const allProducts = await Product.find()
      .populate({ path: "category", model: "Category" })
      .populate({ path: "subcategory", model: "Subcategory" });

    return res.status(200).json({ message: "All Products", data: allProducts });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}


async function getProductsByCategoryOrSubCategory(req, res) {
  console.log(req.body)
  try {
    let query = {};

    if (req.body.categoryId && req.body.subCategoryId) {
      query = {
        category: req.body.categoryId,
        subcategory: req.body.subCategoryId
      };
    } else if (req.body.categoryId) {
      query = {
        category: req.body.categoryId
      };
    } else if (req.body.subCategoryId) {
      query = {
        subcategory: req.body.subCategoryId
      };
    }
    const allProducts = await Product.find(query)
      .populate({ path: "category", model: "Category" })
      .populate({ path: "subcategory", model: "Subcategory" });
    return res.status(200).json({ message: "All Products", data: allProducts });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

// async function deleteProduct(req, res) {
//   console.log(req.body)
//   try {
//     let query = {};

//     if (req.body.categoryId && req.body.subCategoryId) {
//       query = {
//         category: req.body.categoryId,
//         subcategory: req.body.subCategoryId
//       };
//     } else if (req.body.categoryId) {
//       query = {
//         category: req.body.categoryId
//       };
//     } else if (req.body.subCategoryId) {
//       query = {
//         subcategory: req.body.subCategoryId
//       };
//     }
//     const allProducts = await Product.find(query)
//       .populate({ path: "category", model: "Category" })
//       .populate({ path: "subcategory", model: "Subcategory" });
//     return res.status(200).json({ message: "All Products", data: allProducts });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(400).json({ message: "Error", error: error.message });
//   }
// }

async function deleteAllData(req, res) {
  try {
    // Delete all products
    await Product.deleteMany();

    // Delete all subcategories
    await Subcategory.deleteMany();

    // Delete all categories
    await Category.deleteMany();

    return res.status(200).json({ message: "All Categories, Subcategories, and Products have been deleted." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Error", error: error.message });
  }
}

module.exports = {
  addCategory,
  deleteCategory,
  addSubCategory,
  deleteSubCategory,
  addProduct,
  deleteProduct,
  getCategory,
  getProducts,
  getSubCategory,
  getProductsByCategoryOrSubCategory,
  deleteAllData
};
