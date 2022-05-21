const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const AppError = require("../../utils/appError");
const DeliveryBoys = require("../../models/delivery/deliveryBoys");


exports.protect = async(req, res, next) => {
    try {
        // 1) check if the token is there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(
                new AppError(
                    401,
                    "fail",
                    "You are not logged in! Please login in to continue"
                ),
                req,
                res,
                next
            );
        }

        // 2) Verify token
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) check if the Admin is exist or valid (not deleted)
        let user = await DeliveryBoys.findById(decode.id);

        if (!user) {
            return next(
                new AppError(401, "fail", "This user is no longer exist"),
                req,
                res,
                next
            );
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};