/*const mongoose=require('mongoose');

const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,

    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }

},{timestamps:true}
);

//Hash password before saving //

userSchema.pre('save',function(next){
    const user=this;

    //only hash if password is new or modified
    if(!user.isModified('password')) return next();
     

    // hash the password
     bcrypt.genSalt(10,function(err,salt){
     if(err) return next(err);

     bcrypt.hash(user.password,salt,function(err,hash){
        if(err) return next(err);
        user.password=hash;
        next();
        });
    });
});

// compare password when logged by user

userSchema.methods.comparePassword=function (candidatePassword){
    return bcrypt.compare(candidatePassword,this.password);
};

module.exports=mongoose.model('User',userSchema);*/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// Hash password before saving - SIMPLIFIED VERSION
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) return;
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);