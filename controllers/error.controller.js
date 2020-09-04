module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err);
    res.status(200).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}
