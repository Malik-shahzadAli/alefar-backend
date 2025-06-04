const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.js')
router.post("/signup", controller.signup);
router.post("/login",  controller.login);
router.get('/verify-token', authMiddleware, controller.verifyToken);
router.get("/user/:userId", controller.getSingleProduct)
router.post("/search-user", controller.searchUsers)
router.post('/edit-user/:id', authMiddleware, controller.editUser)
router.post('/delete-user/:id', authMiddleware, controller.deleteUser)
module.exports = router;
