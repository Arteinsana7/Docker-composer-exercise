import { Article } from "../models/Article";
import router from "../routes/article";

// CREATE a new article
/**
 * @desc Récuperer les données
 * @route GET api/articles
 * @access Public
 * @params
 */

// POST create a new article
async function createArticle(req, res) {
  try {
    const { titre, content, author, category } = req.body;
    const article = new Article({
      titre,
      content,
      author,
      category,
    });
    const articleSauvegarde = await article.save();

    res.status(201).json({
      //status 201 : Created
      success: true,
      message: "Article creée avec succes",
      data: articleSauvegarde,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: Object.values(error.errors).map((error) => error.message),
        // error.errors = type any = pas de tableau object.values returns un tableau de valeurs de la proprieté innnumerables d'un objet
      });
    }
    res.status(400).json({
      // status 400 : Bad Request
      success: false,
      message: error.message,
    });
  }
}

// GET all articles
async function getAllArticles(req, res) {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    //Status 200 :  OK
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    // 500 : Internal Server Error
    res.status(500).json({
      success: false,
      message: "Erreur lors de la la récuperation des articles",
      error: error.message,
    });
  }
}

// GET article by ID
async function getArticleById(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        messsage: "Article non trouvé",
      });
    }
    await Article.incrementerVues();
    res.status(200).json({
      sucess: true,
      message: article,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        sucess: false,
        message: "id de l'Article non valide",
      });
    }
    res.status(500).json({
      sucess: false,
      message: "erreur lors de la récuperation de l'article",
      error: error.message,
    });
  }
}

// UPDATE an article
async function UpdateArticle(req, res) {
  try {
    const article = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "id de l'Article non valide",
        error: Object.values(error.errors).map((error) => error.message),
      });
    }
    // 500 : Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//DELETE an article
async function deleteArticle(req, res) {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé",
        data: article,
      });
    }
    res.status(200).json({
      success: true,
      message: "Article supprimé avec succès",
    });
  } catch (error) {
    // 500 : Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// resources, gestion d'errors, sttus HTTP, reponse json
