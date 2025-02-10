import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  tags: {
    type: [{ name: String, color: String }],
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensures this is correctly linked to the User model
    required: true,
  },
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;
