// import { Collection, mongo } from "mongoose";
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
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
      type: String,
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

    // commentShema
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Options generales sur l'entite
//   {
// collection: "articles",
//   }

// timestamps: true = create fate gere automatiquement createdAt et updatedAt

articleSchema.methods.publier = function () {
  this.published = true;
  return this.save();
};

articleSchema.methods.depublier = function () {
  this.published = false;
  return this.save();
};

articleSchema.methods.incrementerVues = function () {
  this.views += 1;
  return this.save();
};

// Methodes statiques

articleSchema.statics.findPublished = function () {
  return this.find({ published: true }).sort({ createdAt: -1 });
};

articleSchema.statics.findByCategory = function (category) {
  return this.find({ category, published: true }).sort({ createdAt: -1 });
};

// virtual schemas (Champs virtuels) is used to define fields that are not stored in the database but are computed on the fly

articleSchema.virtual("comments", {
  ref: "Comment", // Le modèle to refrence
  localField: "_id", // Le champ dans Article
  foreignField: "article", // Le champ dans Comment qui fait référence à Article
});

articleSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
  count: true,
});

articleSchema.virtual("summary").get(function () {
  if (this.content.length <= 150) {
    return this.content;
  }
  return this.content.substring(0, 150) + "...";
});

// Middlewares hooks
articleSchema.pre("save", function (next) {
  console.log(`Sauvegarde de l'article : ${this.title}`);
  next();
});

articleSchema.post("save", function (doc) {
  console.log(`Article sauvegardé : ${doc.title} `);
});

export default mongoose.model("Article", articleSchema);

// statiques = sur le modèle pour des requêtes, méthodes d'instance = sur un document pour ses actions,
// virtuels = propriétés calculées.

// donner la ref de l'artcile au schema commentaire , la ref doit correnpondre au nom du modele
// export const Article= mongoose.model("Article", articleSchema);
