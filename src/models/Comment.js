import mongoose from "mongoose";

// objectID reference to the article model
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "L'article est obligatoire"],
    trim: true,
    maxLength: [500, "Le commentaire ne peut pas depasser 500 caracteres"],
  },
  author: {
    type: String,
    required: [true, "L'auteur est obligatoire"],
    trim: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: [true, "L'article est obligatoire"],
  },
});

commentSchema.index({ article: 1 });
export default mongoose.model("Comment", commentSchema);
// définir le schema du commentaire
