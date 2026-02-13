const User=require('../models/User');
const jwt=require('jsonwebtoken');

const JWT_SECRET='sqwsaseendx';
// new user registration

async function register(req,res){
    try{
        const{username,email,password}=req.body;

        //check if user already exists
        const existingUser=await User.findOne({$or:[{email},{username}]});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        //create new user
        const user=new User({
            username,
            email,
            password,
            role:req.body.role||'user'
        });
        await user.save();


        //create token
        const token =jwt.sign(
            {id:user._id, role:user.role},
            JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.status(201).json({
            message:'User Register Succesfully',
            token,
            user:{
               id:user._id,
               username:user.username,
               email:user.email,
               role:user.role 
            }
        });
    }catch(error){
        res.status(500).json({message:error.message});
    }
    
}


//user login 
async function login(req,res) {
    try{
        const{email,password}=req.body;
        //Find User
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'Invalid Credentials'});

        }

        //check password
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid password"});
        }
        //create token

        const token =jwt.sign(
            {id:user._id, role:user.role},
            JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.json({
            message:'User Logged Succesfully',
            token,
            user:{
               id:user._id,
               username:user.username,
               email:user.email,
               role:user.role 
            }
        });
    
    }catch(error){
        res.status(500).json({message:error.message});
    }

    
};

//Get current User

async function getCurrentUser(req,res) {
    try{
        // selct here removes password as for security purposes
        const user=await User.findById(Request.user.id).select('-password');
        res.json(user);

    }catch(error){
        res.status(500).json({message:error});
    }
    
};

module.exports={register,login,getCurrentUser};