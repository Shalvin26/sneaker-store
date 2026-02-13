const express= require('express');
const {connectDB}=require('./connections');
const sneakerRoutes= require('./routes/sneakerRoutes');
const authRoutes=require('./routes/authRoutes')
const uploadRoutes=require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes'); 

const app = express();
const port = 3000;

//connect to database
connectDB('mongodb://127.0.0.1:27017/sneakerdb');

//middleware 
app.use(express.json());
app.use(express.static('public'));


//routes
app.use('/api/auth',authRoutes);
app.use('/api/sneakers',sneakerRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/orders', orderRoutes);  



//trial routes
app.get('/api/test', (req, res) => {
    res.json({message: 'Hello, World!'});
});


//start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
