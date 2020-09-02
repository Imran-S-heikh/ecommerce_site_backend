const express = require('express');
const cookieParser = require('cookie-parser')
const globalErrorhandler = require('./controllers/error.controller');
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cookieParser());


// app.use(cors({
//     preflightContinue: true,
//     credentials: true
// }))

app.use((req,res,next)=>{

    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Credentials',true)

    next();
});

app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);


app.use(globalErrorhandler)



module.exports = app;
