const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../authMiddleware');

// API Auth operations
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);
router.post('/profile', authMiddleware.verifyUser, authController.updateProfile);
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

// Admin controls
router.get('/users', authMiddleware.verifyAdmin, authController.getUsers);
router.get('/admins', authMiddleware.verifyAdmin, authController.getAdmins);
router.post('/create-admin', authMiddleware.verifyAdmin, authController.createAdmin);
router.delete('/users/:id', authMiddleware.verifyAdmin, authController.deleteUser);
router.delete('/admins/:id', authMiddleware.verifyAdmin, authController.deleteAdmin);

module.exports = router;
