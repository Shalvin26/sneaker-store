const express = require('express');
const router = express.Router();
const {register,login,getCurrentUser}=require('../controllers/authcontroller');
const {verifyToken}=require('../middleware/auth');


//Register Route
router.post('/register',register);

//Login route
router.post('/login',login);

//Get current user
router.get('/me',verifyToken,getCurrentUser);

module.exports=router;