const mongoose = require('mongoose')
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Apply unique constraint at the schema level
    index: true,
  },
  // Additional store properties
});

const gpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
  ],
  // Additional GP properties
});

const blockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GP',
    },
  ],
  // Additional block properties
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
    },
  ],
  // Additional project properties
});

// Create unique indexes on 'name' field in the respective collections
storeSchema.index({ name: 1 }, { unique: true });
gpSchema.index({ name: 1 }, { unique: true });
blockSchema.index({ name: 1 }, { unique: true });
locationSchema.index({ name: 1 }, { unique: true });


const Store = mongoose.model('Store', storeSchema);
const GP = mongoose.model('GP', gpSchema);
const Block = mongoose.model('Block', blockSchema);
const Location = mongoose.model('Location', locationSchema);


module.exports={ Store, GP, Block, Location };
