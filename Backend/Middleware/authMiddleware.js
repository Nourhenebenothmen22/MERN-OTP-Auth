import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized, no token provided" 
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Utilisez decoded.id au lieu de decoded.userId
    req.userId = decoded.id;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token"
      });
    }

    // Passer au middleware suivant
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};