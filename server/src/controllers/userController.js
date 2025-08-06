// controllers/userController.js
export const getUserProfile = (req, res) => {
  res.json({ message: `User profile for ${req.user.name}` })
}

export const updateUser = (req, res) => {
  res.json({ message: 'User profile updated' })
}

export const getAllUsers = (req, res) => {
  res.json({ message: 'Fetched all users (admin only)' })
}
