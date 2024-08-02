const jsonErrorHandler = (err, req, res, next) =>{
    res.status(500).json({
        code: err.code,
        name: err.name,
        message:err.message,
    });
    return next();
}