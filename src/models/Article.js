import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      maxLength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'auteur est obligatoire"],
    },
    published: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ["Tech", "Health", "Sports", "Entertainment", "Business", "Other"],
    },
    vues: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// instance methods
articleSchema.methods.publier = function () {
  this.published = true;
  return this.save();
};

articleSchema.methods.depublier = function () {
  this.published = false;
  return this.save();
};

articleSchema.methods.incrementerVues = function () {
  this.vues += 1;
  return this.save();
};

// Static methods
articleSchema.statics.findPublished = function () {
  return this.find({ published: true }).sort({ createdAt: -1 });
};

articleSchema.statics.findByCategory = function (category) {
  return this.find({ category, published: true }).sort({ createdAt: -1 });
};

// Virtual champs
articleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
});

articleSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
  count: true,
});

articleSchema.virtual("summary").get(function () {
  if (!this.content) return ""; // NEW : Verify content exists
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
  console.log(`Article sauvegardé : ${doc.title}`);
});

export default mongoose.model("Article", articleSchema);
