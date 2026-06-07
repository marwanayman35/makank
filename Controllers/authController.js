const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Hashed admin array in MongoDB or mock setup support
let mockAdmins = [
  { id: 'ADM-001', name: 'Master Admin', email: 'admin@makank.com', password: '$2b$10$ECjKIW2NQH01/fxWgQmXWOZtzRfeuYIitce2PJkKrm80RtcpIKFYq' }
];

const authController = {
  register: async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || fullname.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Full name must be at least 3 characters long.' });
    }
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: fullname,
        email: email.toLowerCase(),
        password: hashedPassword, // secure password hash
        created: new Date().toISOString().split('T')[0],
        tickets: []
      });

      await newUser.save();
      return res.status(201).json({ success: true, user: newUser });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Authenticate user or admin login
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1. Check if email/password matches an admin in mockAdmins (hashed comparison)
      const admin = mockAdmins.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (admin) {
        const adminPassMatch = await bcrypt.compare(password, admin.password);
        if (adminPassMatch) {
          if (req.session) {
            req.session.admin = { id: admin.id, name: admin.name, email: admin.email };
          }
          return res.status(200).json({ success: true, isAdmin: true, admin });
        }
      }

      // 2. Otherwise, check user in database
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Incorrect email or password' });
      }

      // Check password matching (support both bcrypt hashes and legacy plaintext records)
      let isMatch = false;
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        isMatch = (user.password === password);
      }

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect email or password' });
      }

      // Set user in session
      if (req.session) {
        req.session.user = { id: user.id, name: user.name, email: user.email };
      }

      return res.status(200).json({ success: true, isAdmin: false, user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Authenticate admin access
  adminLogin: async (req, res) => {
    const { adminEmail, adminPassword } = req.body;

    try {
      const admin = mockAdmins.find(a => a.email.toLowerCase() === adminEmail.toLowerCase());
      if (!admin) {
        return res.status(400).json({ success: false, message: 'Incorrect admin credentials' });
      }

      const adminPassMatch = await bcrypt.compare(adminPassword, admin.password);
      if (!adminPassMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect admin credentials' });
      }

      // Set admin in session
      if (req.session) {
        req.session.admin = { id: admin.id, name: admin.name, email: admin.email };
      }

      return res.status(200).json({ success: true, admin });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Save changes to standard user profile
  updateProfile: async (req, res) => {
    const { fullname, newPassword } = req.body;
    const sessionEmail = req.headers['x-user-email'] || (req.session && req.session.user && req.session.user.email);

    if (!sessionEmail) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    if (fullname !== undefined && fullname.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Full name must be at least 3 characters long.' });
    }
    if (newPassword !== undefined && newPassword.trim().length > 0 && newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    try {
      const user = await User.findOne({ email: sessionEmail.toLowerCase() });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found' });
      }

      if (fullname) {
        user.name = fullname.trim();
        if (req.session && req.session.user) {
          req.session.user.name = user.name;
        }
      }

      if (newPassword && newPassword.trim().length > 0) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      await user.save();
      return res.status(200).json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Retrieve all registered users
  getUsers: async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json({ success: true, users });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Retrieve all admin accounts
  getAdmins: async (req, res) => {
    try {
      return res.status(200).json({ success: true, admins: mockAdmins });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Create a new admin account
  createAdmin: async (req, res) => {
    const { newAdminName, newAdminEmail, newAdminPassword } = req.body;

    try {
      const emailExists = mockAdmins.some(a => a.email.toLowerCase() === newAdminEmail.toLowerCase());
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Admin email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newAdminPassword, salt);

      const newAdmin = {
        id: 'ADM-' + Math.floor(100 + Math.random() * 900),
        name: newAdminName,
        email: newAdminEmail.toLowerCase(),
        password: hashedPassword
      };

      mockAdmins.push(newAdmin);
      return res.status(201).json({ success: true, admin: newAdmin });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete user by ID
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      await User.findOneAndDelete({ id: id });
      return res.status(200).json({ success: true, message: 'User successfully deleted' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete admin by ID
  deleteAdmin: async (req, res) => {
    const { id } = req.params;

    try {
      if (mockAdmins.length <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last remaining admin account' });
      }
      mockAdmins = mockAdmins.filter(a => a.id !== id);
      return res.status(200).json({ success: true, message: 'Admin account deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // EJS view endpoints for authentication pages
  getLogin: (req, res) => {
    res.render('login');
  },

  postLogin: async (req, res) => {
    return authController.login(req, res);
  },

  getRegister: (req, res) => {
    res.render('register');
  },

  postRegister: async (req, res) => {
    return authController.register(req, res);
  },

  logout: (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
          return res.status(200).json({ success: true, message: 'Logged out successfully' });
        }
        return res.redirect('/login');
      });
    } else {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
      }
      return res.redirect('/login');
    }
  }
};

module.exports = authController;
