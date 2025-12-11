import Article from "../models/Article.js";

/**
 * @desc    Create a new Article
 * @route   POST /api/articles
 * @access  Private
 */

// === CREATE AN ARTICLE ===
export async function createArticle(req, res) {
  try {
    const { title, content, category } = req.body;
    const article = new Article({
      title,
      content,
      // the author is alwaysa  connected user
      author: req.user._id,
      category,
    });
    const articleSauvegarde = await article.save();

    res.status(201).json({
      success: true,
      message: "Article créé avec succès",
      data: articleSauvegarde,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'article",
      error: error.message,
    });
  }
}

/**
 * @desc   find all articles
 * @route   GET /api/articles
 * @access  Public
 */

// === GET ALL ARTICLES ===
export async function getAllArticles(req, res) {
  try {
    const articles = await Article.find()
      .populate("author", "nom email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles",
      error: error.message,
    });
  }
}

/**
 * @desc    find article by id
 * @route   GET /api/articles/:id
 * @access  Public
 */

// === GET AN ARTICLE BY ID ===
//Public routes
export async function getArticleById(req, res) {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "nom email"
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    await article.incrementerVues();

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID de l'article non valide",
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'article",
      error: error.message,
    });
  }
}

/**
 * @desc    find and article with his commentaries
 * @route   GET /api/articles/:id/with-comments
 * @access  Public
 */

// === GET ARTICLE WITH COMMENTS ===

export async function getArticleWithComments(req, res) {
  try {
    const article = await Article.findById(req.params.id).populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    await article.incrementerVues();

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID de l'article non valide",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'article",
      error: error.message,
    });
  }
}

/**
 * @desc    Mettre à jour un article
 * @route   PUT /api/articles/:id
 * @access  Public
 */

// === UPDATE AN ARTICLE ===
export async function updateArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    // Veryfy that the user is connected to the author
    if (article.author.toString() !== req.user._id.toString()) {
      //_id is an object so we convert to string
      return res.status(403).json({
        success: false,
        message: "Non autorisé : vous n'êtes pas l'auteur de cet article",
      });
    }

    // Now we can modify
    const { title, content, category } = req.body;
    if (title) article.title = title;
    if (content) article.content = content;
    if (category) article.category = category;

    const articleModifie = await article.save();

    res.status(200).json({
      success: true,
      message: "Article mis à jour avec succès",
      data: articleModifie,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID de l'article non valide",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour",
      error: error.message,
    });
  }
}

/**
 * @desc    Récupérer les articles publiés
 * @route   GET /api/articles/published
 * @access  Public
 */

// === GET PUBLISH ARTICLES ===
export async function getPublishedArticles(req, res) {
  try {
    const articles = await Article.findPublished();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles publiés",
      error: error.message,
    });
  }
}

/**
 * @desc    Supprimer un article
 * @route   DELETE /api/articles/:id
 * @access  Public
 */

// === DELETE AN ARTICLE ===
export async function deleteArticle(req, res) {
  try {
    // first just get the article
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }
    // and we verify that the user connected is the author
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé : vous n'êtes pas l'auteur de cet article",
      });
    }
    // now we can delete it
    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: "Article supprimé avec succès",
      data: article,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "ID de l'article non valide",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
      error: error.message,
    });
  }
}
