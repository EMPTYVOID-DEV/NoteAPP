import mongoose from "mongoose";

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: {
    type: Map,
    default: new Map(),
    of: new mongoose.Schema({
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      ImagesPaths: {
        type: [String],
        default: [],
      },
      tags: {
        type: [String],
        default: [],
      },
    }),
  },
  tags: {
    type: Map,
    default: new Map(),
    of: { type: String },
  },
});
export default mongoose.model("users", user);
