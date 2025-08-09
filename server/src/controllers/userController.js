import User from '../models/User.js'
/**
 * Register fingerprint hash for a student
 * @route POST /api/users/students/:id/fingerprint
 * @access Admin or Teacher
 */
export const registerFingerprint = async (req, res) => {
  try {
    const { fingerprintHash } = req.body;
    const { id } = req.params;

    if (!fingerprintHash || fingerprintHash.length < 16) {
      return res.status(400).json({ error: 'Invalid fingerprint hash.' });
    }

    const student = await User.findByIdAndUpdate(id, { fingerprintHash }, { new: true });
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found or invalid role.' });
    }

    res.status(200).json({ message: 'Fingerprint registered successfully', student });
  } catch (err) {
    console.error('[registerFingerprint]', err);
    res.status(500).json({ error: 'Failed to register fingerprint.' });
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// @desc    Update logged-in user's info
// @route   PUT /api/users/update
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await User.findById(req.user._id)

    if (!user) return res.status(404).json({ error: 'User not found' })

    user.name = name || user.name
    user.email = email || user.email

    await user.save()

    const updatedUser = await User.findById(req.user._id).select('-password')
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}


// @desc    Get all users or filter by role (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// @desc    Get users by role (admin only)
// @route   GET /api/users?role=teacher
// @access  Private/Admin
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query
    const validRoles = ['admin', 'teacher', 'student']

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Valid role query param required: admin, teacher, student' })
    }

    const users = await User.find({ role }).select('-password')
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}
