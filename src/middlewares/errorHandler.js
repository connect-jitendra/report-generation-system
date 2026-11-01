

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    console.error(req.method, req.originalUrl, err);

    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Something went wrong" : err.message
    });
};

export default errorHandler;