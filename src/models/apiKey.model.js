"use strict";

const mongoose = require("mongoose"); // Erase if already required

const Schema = mongoose.Schema;

const COLLECTION_NAME = "apiKeys";
const DOCUMENT_NAME = "apiKeys";

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "0001", "0002", "0003"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);
