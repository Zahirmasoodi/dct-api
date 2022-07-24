const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const treeSchema = new Schema(
  {
    name: { type: String },
    nodes: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Tree = mongoose.model("Tree", treeSchema);

module.exports = Tree;
