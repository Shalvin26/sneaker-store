const express=require('express');
const router=express.Router();


const { getAllSneakers,getSneakerById,
    createSneaker,updateSneaker,
    deleteSneaker}=require('../controllers/sneakercontroller');
 const {verifyToken,isAdmin}=require('../middleware/auth')
//Public Routes
//get all sneakers
router.get('/',getAllSneakers);
//get single sneakers
router.get('/:id',getSneakerById);

//Protected routes

//create a sneaker (post)
router.post('/',verifyToken,isAdmin,createSneaker);
//put update sneaker
router.put('/:id',verifyToken,isAdmin,updateSneaker);
//delete sneaker
router.delete('/:id',verifyToken,isAdmin,deleteSneaker);

module.exports=router;
