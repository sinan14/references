const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const user = require("../models/user");
const Employee = require("../models/employee");
const Stores = require("../models/store");

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
      return next(
        new AppError(404, "fail", "Please provide email or password"),
        req,
        res,
        next
      );
    }
    const store = await Stores.findOne({
      email: email,
      isDisabled: false,
    });
    if (store) {
      let validPassword = await bcrypt.compare(password, store.password);
      if (!validPassword) {
        return next(
          new AppError(401, "fail", "Email or Password is wrong"),
          req,
          res,
          next
        );
      }
      const token = createToken(store.id);

      store.password = undefined;
      let response = {
        status: "success",
        token,
        isStore: true,
        name: store.name,
        message: "Store logged in successfully",
      };

      return res.status(200).json(response);
    } else {
      // 2) check if user exist and password is correct
      const employee = await Employee.findOne({
        workEmail: email,
      });

      if (employee) {
        let validPassword = await bcrypt.compare(password, employee.password);

        if (!validPassword) {
          return next(
            new AppError(401, "fail", "Email or Password is wrong"),
            req,
            res,
            next
          );
        }

        // 3) All correct, send jwt to client
        const token = createToken(employee.id);

        // Remove the password from the output
        employee.password = undefined;

        if (employee.isAdmin) {
          let response = {
            status: "success",
            token,
            isAdmin: true,
            message: "Admin logged in successfully",
          };

          res.status(200).json(response);
        } else {
          if (employee.photo) {
            employee.photo = process.env.BASE_URL.concat(employee.photo);
          } else {
            employee.photo = null;
          }

          res.status(200).json({
            status: "success",
            token,
            isAdmin: false,
            message: "Employee logged in successfully",
            data: {
              employee_photo: employee.photo,
              employee_id: employee.employeeId,
              name: employee.firstname + " " + employee.lastname,
              permissions: employee.permissions,
              departmentId: employee.department,
            },
          });
        }
      } else {
        return next(
          new AppError(401, "fail", "Email or Password is wrong"),
          req,
          res,
          next
        );
      }
    }

    // const user = await User.findOne({
    //   email,
    // }).select("+password");
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    const token = createToken(user.id);

    user.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
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
    let user = await Employee.findById(decode.id);

    let isStore = false;
    if (!user) {
      user = await Stores.findById(decode.id);
      if (!user) {
        return next(
          new AppError(401, "fail", "This user is no longer exist"),
          req,
          res,
          next
        );
      } else {
        isStore = true;                
      }
    } else {
      if (user.isAdmin) {
        req.isAdmin = true;
      } else {
        req.isEmployee = true;
      }
    }

    req.user = user;
    req.isStore = isStore;
    next();
  } catch (err) {
    next(err);
  }
};

exports.userProtect = async (req, res, next) => {
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

    // 3) check if the user is exist (not deleted)
    const result = await user.findById(decode.id);
    if (!result) {
      return next(
        new AppError(401, "fail", "This user is no longer exist"),
        req,
        res,
        next
      );
    }

    req.user = result;
    next();
  } catch (err) {
    next(err);
  }
};

// Authorization check if the user have rights to do this action
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(
        new AppError(403, "fail", "You are not allowed to do this action"),
        req,
        res,
        next
      );
    }
    next();
  };
};
