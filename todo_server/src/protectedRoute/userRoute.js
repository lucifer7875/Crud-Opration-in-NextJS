const express = require('express');
const userController = require('./userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', authMiddleware, userController.getAllUser);
router.get('/user-count', authMiddleware, userController.getUserCountInWeek)
router.get('/tags/intresedArea', authMiddleware, userController.getAllIntrestedAre);
router.get('/users/:id', authMiddleware, userController.getOneUser);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);
router.post('/', authMiddleware, userController.createUser);
router.post('/userswithbody', authMiddleware, userController.getAllUserWithBody)
router.post('/imageupload', userController.getImageUpload);

module.exports = router;
