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
      // the author is always a connected user
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
 * @desc    Get all articles with pagination, filtering, sorting, and search
 * @route   GET /api/articles
 * @access  Public
 * @query   page, limit, sort, category, published, search
 */

export async function getAllArticles(req, res) {
  try {
    // === 1. EXTRACTION  QUERY PARAMS ===
    const {
      page = 1, // Page default : 1
      limit = 10, // default limit : 10 articles
      sort = "-createdAt", // sort : by default the newest articles first
      category, // Filter by category (optional)
      published, // Filter by statut (optional)
      search, // Search by word (optional)
    } = req.query;

    // === 2. CONSTRUCTION OF THE FILTER ===
    const filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by published status
    if (published !== undefined) {
      filter.published = published === "true"; // Conversion string => boolean
    }

    // Recherche by keyword in title or content
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // insensible to the case
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // === 3. PAGINATION ===
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // === 4. REQ WITH ALL FILTERS ===
    const articles = await Article.find(filter)
      .populate("author", "nom email")
      .sort(sort) // Dynamic sorting
      .skip(skip) // jump from previous pages
      .limit(limitNumber); // limit

    // === 5. TOTAL COUNT FOR PAGINATION ===
    const total = await Article.countDocuments(filter);

    // === 6. CALCULATION OF THE NUMBER OF PAGES ===
    const totalPages = Math.ceil(total / limitNumber);

    // === 7. RESPONSE ===
    res.status(200).json({
      success: true,
      count: articles.length, // Articles on this page
      total, //total articles matching the filter
      page: pageNumber, // Current page
      totalPages, //  Articles total per pages
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
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
 * @desc    find and article with his comments
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
 * @desc  update an article
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

    // Veryfy that the user is the author
    if (!article.author.equals(req.user._id)) {
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
 * @desc    Get all published articles
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
 * @desc    Toggle publish/unpublish article
 * @route   PATCH /api/articles/:id/publish
 * @access  Private (Author only)
 */
// === TOGGLE PUBLISH ARTICLE ===
export async function togglePublishArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    // Verify that the user is the author
    if (!article.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé : vous n'êtes pas l'auteur de cet article",
      });
    }

    // Toggle the publish status (use custom model methods)
    if (article.published) {
      await article.depublier();
    } else {
      await article.publier();
    }

    res.status(200).json({
      success: true,
      message: article.published
        ? "Article publié avec succès"
        : "Article mis en brouillon",
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
      message: "Erreur lors de la publication",
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
    // and we verify that the user is the author
    if (!article.author.equals(req.user._id)) {
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
