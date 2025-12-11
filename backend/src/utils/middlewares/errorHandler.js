import AppError from "../AppError.js";

// Handler for Mongoose validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Données invalides : ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handler for cast errors (invalid ID)
const handleCastError = (err) => {
  const message = `${err.path} invalide : ${err.value}`;
  return new AppError(message, 400);
};

// Handler for duplicate fields (unique key violation)
const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `La valeur "${value}" existe déjà pour le champ "${field}".`;
  return new AppError(message, 400);
};

// Handler for JWT errors
const handleJWTError = () => {
  return new AppError("Token invalide. Veuillez vous reconnecter.", 401);
};

// Handler for JWT expired errors
const handleJWTExpiredError = () => {
  return new AppError(
    "Votre session a expiré. Veuillez vous reconnecter.",
    401
  );
};

// SEND ERRORS in development (complete details)
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// SEND ERRORS in production (hide details)
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Known error: show to client
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown error: hide details
    console.error("❌ ERREUR:", err);

    res.status(500).json({
      success: false,
      status: "error",
      message: "Une erreur est survenue.",
    });
  }
};

// MAIN ERROR HANDLER MIDDLEWARE
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Transform Mongoose errors
    if (error.name === "CastError") {
      error = handleCastError(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsError(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationError(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

// 404 NOT FOUND MIDDLEWARE
export const notFound = (req, res, next) => {
  const message = `Route non trouvée : ${req.method} ${req.originalUrl}`;
  next(new AppError(message, 404));
};

// CATCH ASYNC WRAPPER
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
