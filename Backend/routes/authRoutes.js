const express = require('express')
const { registerController, loginController, getUserController } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/getUser', authMiddleware, getUserController)

module.exports = router