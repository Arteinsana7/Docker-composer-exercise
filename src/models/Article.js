// import { Collection, mongo } from "mongoose";
import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    // enssemble des attributs d'un article
    // titre, contenu, auteur, publié, categorie, vues
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      maxLength: [200, "le titre ne peut aps depasser 200 caracteres"],
    },
    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: ["Tech", "Health", "Sports", "Entertainment", "Business", "Other"],
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "articles",
  }

  //Options generales sur l'entite
  //   {
  // collection: "articles",
  //   }

  // timestamps: true = create fate gere automatiquement createdAt et updatedAt
);

export const Article = mongoose.model("Article", ArticleSchema);
