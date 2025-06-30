// Middleware d'autorisation basé sur les rôles
// Usage : router.get('/admin', authMiddleware, authorizeRoles('admin'), ...)
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit" });
  }
  next();
}; 