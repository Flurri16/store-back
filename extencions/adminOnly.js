export const adminOnly = async (req, res, next) => {
  if (req.isAdmin !== 'admin@gmail.com') {
    return res.status(403).json({ message: "Brak dostępu: tylko admin." })
  }
  next()
}