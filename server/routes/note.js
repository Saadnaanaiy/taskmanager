import express from "express";
import authMiddleware from "../middleware/middleware.js";
import Note from "../models/Note.js";

const router = express.Router();

// Add a new note
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, desc, tags, date } = req.body;

    // Create the new note with the logged-in user's ID
    const newNote = new Note({
      title,
      desc,
      tags,
      date,
      userId: req.user.id, // Attach the user ID
    });

    await newNote.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Note added successfully!",
        note: newNote,
      });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ success: false, message: "Failed to add note!" });
  }
});

// Get all notes for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Fetch notes specific to the logged-in user
    const notes = await Note.find({ userId: req.user.id });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve notes!" });
  }
});

// Update a note by ID (only if it belongs to the logged-in user)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note and ensure it belongs to the user
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true } // Return the updated document
    );

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found or unauthorized!" });
    }

    return res.status(200).json({ success: true, note });
  } catch (err) {
    console.error("Error updating note:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update note!" });
  }
});

// Delete a note by ID (only if it belongs to the logged-in user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note and ensure it belongs to the user
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found or unauthorized!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Note deleted successfully!", note });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ success: false, message: "Failed to delete note!" });
  }
});

export default router;
