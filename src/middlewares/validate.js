import AppError from "../utils/AppError.js";

const validate = (schema, source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const errorMessage = result.error.issues[0].message;
            return next(new AppError(errorMessage, 400));
        }

        next();
    };
};

export default validate;