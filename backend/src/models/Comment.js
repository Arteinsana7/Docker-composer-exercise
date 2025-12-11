import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      trim: true,
      minlength: [1, "Le contenu ne peut pas être vide"], // requided min length
      maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // ObjectId instead of String
      ref: "User", //Ref to the user model
      required: [true, "L'auteur est obligatoire"],
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: [true, "L'article est obligatoire"],
    },
    likes: {
      //simple like count implementation later we can expand it
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Add createdAt et updatedAt automatiquement
  }
);

// Index for faster queries
commentSchema.index({ article: 1 });
commentSchema.index({ author: 1 }); // index on author for faster lookups

export default mongoose.model("Comment", commentSchema);
