const Sneaker=require('../models/sneakers');

//Get all sneakers

async function getAllSneakers(req,res) {
    try{
        const sneakers=await Sneaker.find();
        res.json(sneakers);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// get single sneaker
async function getSneakerById(req,res) {
    try{
        const sneaker=await Sneaker.findById(req.params.id);
        //no sneaker found then 
        if(!sneaker){
        return res.status(404).json({message:'Sneaker not found'});
        }

        res.json(sneaker);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

//Create new Sneaker
async function createSneaker(req,res) {
    const sneaker=new Sneaker({
        name:req.body.name,
        brand:req.body.brand,
        price:req.body.price,
        size:req.body.size,
        image:req.body.image,
        description:req.body.description
    });

    try{
        const newSneaker=await sneaker.save();
        res.status(201).json(newSneaker);

    }catch(error){
         res.status(400).json({message:error.message});
    }
};

//update sneaker
async function updateSneaker(req,res) {
    try{
    const sneaker= await Sneaker.findByIdandUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    if(!sneaker){
        return res.status(404).json({message:'Sneaker not found'});

    }
    res.json(sneaker);


    }catch(error){
         res.status(400).json({message:error.message});
    }
};

//delete sneaker

async function deleteSneaker(req,res) {
    try{
    const sneaker= await Sneaker.findByIdAndDelete(req.params.id);
    if(!sneaker){
        return res.status(404).json({message:'Sneaker not found'});
    }
    res.json({message:'Sneaker deleted successfully'});
    }catch(error){
         res.status(500).json({message:error.message});
    }
};

module.exports={
    getAllSneakers,getSneakerById,createSneaker,updateSneaker,deleteSneaker
}


