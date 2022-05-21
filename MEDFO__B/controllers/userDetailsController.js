const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const UserAddress = require("../models/userAddress");
const AdsProfileAddress = require("../models/ads/profile/address");
const UserFamily = require("../models/user/family");
const UserMedical = require("../models/user/medical");
const UserProfileFeedback = require("../models/user/profileFeedback");
const User = require("../models/user");
const HealthVault = require("../models/user/healthVault");
const Prescription = require("../models/prescription");
const PremiumUser = require("../models/user/premiumUser");

const UserPrescriptionAdmin = require("../models/user/userPrescriptionAdmin");

// const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");
// const AdsMedimallTopIconCatHealth = require("../models/ads/medimall/topIconCatHealth");
// const Inventory = require("../models/inventory");
// const MasterUOMValue = require("../models/mastersettings/uomValue");
// const categoryTypeHealth = "healthcare";

const imgPath = process.env.BASE_URL;
const defaultImage = "medfeed/head.jpeg";

const doAddUserAddress = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let type = data.type.replace(/\s+/g, " ").trim();
      const homeTypes = ["home", "office", "other"];
      if (homeTypes.includes(type)) {
        // let isDefaultAddress = await UserAddress.findOne({
        //   isDisabled: false,
        //   userId: req.user._id,
        // });
        // console.log(isDefaultAddress);
        // if (!isDefaultAddress) {
        // data.isDisabled = false;
        // }

        let result = await UserAddress.updateMany(
          { userId: data.userId },
          { $set: { isDisabled: true } }
        );

        data.isDisabled = false;
        let schemaObj = new UserAddress(data);
        schemaObj
          .save()
          .then((response) => {
            resolve({
              error: false,
              message: "Address added successfully",
            });
          })
          .catch(async (error) => {
            resolve({
              error: true,
              message: error.message,
            });
          });
      } else {
        resolve({
          error: true,
          message: "Invalid address type",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  /* User add address
    ============================================= */

  doAddUserAddress,

  addUserAddress: async (req, res, next) => {
    try {
      let data = req.body;
      data.userId = req.user._id;

      let response = await doAddUserAddress(data);

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  getUserAddress: async (req, res, next) => {
    try {
      let banner = "";

      let profileBanner = await AdsProfileAddress.find(
        { sliderType: "address", isDisabled: false },
        {
          type: 1,
          typeId: 1,
          image: { $concat: [imgPath, "$image"] },
          sliderType: 1,
        }
      );
      if (profileBanner.length) {
        banner = profileBanner[0].image;
      }

      let address = await UserAddress.find(
        { userId: mongoose.Types.ObjectId(req.user._id) },
        {
          name: 1,
          mobile: 1,
          pincode: 1,
          house: 1,
          street: 1,
          landmark: 1,
          type: 1,
          state: 1,
          isDisabled: 1,
          latitude: 1,
          longitude: 1,
        }
      );
      res.status(200).json({
        error: false,
        message: "Addresses are",
        data: {
          image: banner,
          address: address,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUserAddressById: async (req, res, next) => {
    try {
      let result = await UserAddress.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          name: 1,
          mobile: 1,
          pincode: 1,
          house: 1,
          street: 1,
          landmark: 1,
          type: 1,
          state: 1,
          isDisabled: 1,
          latitude: 1,
          longitude: 1,
        }
      );
      if (result) {
        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editUserAddress: async (req, res, next) => {
    try {
      let data = req.body;
      if (data.id) {
        let address = await UserAddress.findOne({
          _id: mongoose.Types.ObjectId(data.id),
        });
        if (address) {
          let type = data.type.replace(/\s+/g, " ").trim();
          const homeTypes = ["home", "office", "other"];
          if (homeTypes.includes(type)) {
            // let existAddress = await UserAddress.findOne({
            //     house: data.house,
            //     userId: req.user._id,
            //     _id: { $ne: address._id },
            // });
            // if (!existAddress) {
            let result = await UserAddress.updateMany(
              { userId: req.user._id },
              { $set: { isDisabled: true } }
            );

            data.isDisabled = false;
            data.updatedAt = new Date();
            UserAddress.updateOne(
              { _id: mongoose.Types.ObjectId(data.id) },
              data
            )
              .then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    error: false,
                    message: "Address Updated Successfully",
                  });
                } else {
                  res.status(200).json({
                    error: true,
                    nessage:
                      "Something went wrong. Please try after some time.",
                  });
                }
              })
              .catch((error) => {
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
            // } else {
            //     res.status(200).json({
            //         error: true,
            //         message: "Home name already exist",
            //     });
            // }
          } else {
            res.status(200).json({
              error: true,
              message: "Invalid type",
            });
          }
        } else {
          res.status(200).json({
            error: true,
            message: "Invalid id",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Please enter id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  changeStatusUserAddress: async (req, res, next) => {
    try {
      let data = {};
      let result = await UserAddress.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (result) {
        data.updatedAt = new Date();
        data.isDisabled = false;
        let result = await UserAddress.updateMany(
          { userId: req.user._id },
          { $set: { isDisabled: true } }
        );
        UserAddress.updateOne(
          { _id: mongoose.Types.ObjectId(req.params.id) },
          data
        )
          .then((response) => {
            if (response.nModified == 1) {
              res.status(200).json({
                error: false,
                message: "Status changed successfully",
              });
            } else {
              res.status(200).json({
                error: true,
                message: "Something went wrong. Please try after some time",
              });
            }
          })
          .catch((error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteUserAddress: async (req, res, next) => {
    try {
      let address = await UserAddress.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (address) {
        UserAddress.deleteOne({ _id: req.params.id })
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Address deleted successfully.",
            });
          })
          .catch((error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /* User Personal details add or update
    ============================================= */
  addUserPersonalDetails: async (req, res, next) => {
    try {
      let data = req.body;
      data.userId = req.user._id;
      let personal = await User.findOne({ _id: req.user._id });
      if (personal) {
        if (!data.email) {
          data.email = personal.email;
        }
        data.image = personal.image;

        if (!personal.image) {
          data.image = defaultImage;
        }

        if (data.name) {
          data.name = data.name + " " + data.surname;
        }

        let isEmailExist = await User.findOne({
          email: data.email,
          _id: { $ne: req.user._id },
        });
        if (!isEmailExist) {
          let maritalStatus = "";
          let gender = "";
          if (data.maritalStatus)
            maritalStatus = data.maritalStatus.replace(/\s+/g, " ").trim();
          const maritalStatusTypes = ["single", "married", ""];

          if (data.gender) gender = data.gender.replace(/\s+/g, " ").trim();
          const genderTypes = ["male", "female", "other", ""];
          if (
            maritalStatusTypes.includes(maritalStatus) &&
            genderTypes.includes(gender)
          ) {
            if (req.file) {
              data.image = `users/${req.file.filename}`;
              // deleting old image
              if (personal.image) {
                if (personal.image != defaultImage) {
                  let splittedImageRoute = personal.image.split("/");
                  let path = `./public/images/user/${splittedImageRoute[1]}`;
                  if (fs.existsSync(path)) {
                    fs.unlink(path, function (err) {
                      if (err) throw err;
                    });
                  }
                }
              }
            }

            User.updateOne({ _id: req.user._id }, data)
              .then(async (response) => {
                res.status(200).json({
                  error: false,
                  message: "User details updated successfully",
                });
              })
              .catch(async (error) => {
                if (req.file) {
                  await unlinkAsync(req.file.path);
                }
                res.status(200).json({
                  error: true,
                  message: error,
                });
              });
          } else {
            res.status(200).json({
              error: true,
              message: "Invalid marital status or gender",
            });
          }
        } else {
          res.status(200).json({
            error: false,
            message: "Email already exist",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid user id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserPersonalDetails: async (req, res, next) => {
    try {
      if (!req?.user?._id) {
        return res.status(200).json({
          message: "User id is required.",
          error: true,
          data: {},
        });
      }

      let result = {};
      result = await User.findOne(
        {
          _id: mongoose.Types.ObjectId(req.user._id),
        },
        {
          gender: 1,
          dob: 1,
          bloodGroup: 1,
          maritalStatus: 1,
          height: 1,
          weight: 1,
          email: 1,
          name: 1,
          phone: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      ).lean();
      if (result) {
        var percentage = 0;

        if (result.name) {
          percentage += 10;
        }
        if (result.email) {
          percentage += 10;
        }
        if (result.phone) {
          percentage += 10;
        }
        if (result.gender) {
          percentage += 10;
        }
        if (result.dob) {
          percentage += 10;
        }
        if (result.bloodGroup) {
          percentage += 10;
        }
        if (result.maritalStatus) {
          percentage += 10;
        }
        if (result.height) {
          percentage += 10;
        }
        if (result.weight) {
          percentage += 10;
        }
        if (result.image) {
          percentage += 10;
        }
        result.percentage = percentage;

        let name = result.name;

        index = name.indexOf(" "); // Gets the first index where a space occours
        let fname = name.substr(0, index);
        let surname = name.substr(index + 1);
        if (!fname) {
          fname = surname;
          surname = "";
        }

        result.name = fname;
        result.surname = surname;
        result.premiumUser = false;

        //check if premium user

        const premiumUsers = await PremiumUser.findOne({
          userId: mongoose.Types.ObjectId(req.user._id),
          active: true,
          expired: false,
        });

        if (premiumUsers) {
          result.premiumUser = true;
        }

        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },

  userChangePassword: async (req, res, next) => {
    try {
      if (
        req.body.oldPassword &&
        req.body.newPassword &&
        req.body.confirmNewPassword
      ) {
        let data = req.body;
        let userId = req.user._id;
        if (data.newPassword.length >= 8) {
          if (data.newPassword == data.confirmNewPassword) {
            let result = await User.findOne(
              {
                _id: mongoose.Types.ObjectId(req.user._id),
              },
              {
                password: 1,
              }
            ).lean();

            let verified = await bcrypt.compare(
              req.body.oldPassword,
              result.password
            );
            if (verified) {
              let newPassword = await bcrypt.hash(data.newPassword, 12);

              User.updateOne(
                { _id: userId },
                { $set: { password: newPassword } }
              )
                .then((response) => {
                  if (response.nModified == 1) {
                    res.status(200).json({
                      error: false,
                      message: "Password changed successfully",
                    });
                  } else {
                    res.status(200).json({
                      error: true,
                      message:
                        "Something went wrong.Please try after some time",
                    });
                  }
                })
                .catch((error) => {
                  res.status(200).json({
                    error: true,
                    message: error + "",
                  });
                });
            } else {
              res.status(200).json({
                error: true,
                message: "Sorry, Your old password was incorrect.",
              });
            }
          } else {
            res.status(200).json({
              error: true,
              message: "The new password and confirm password do not match.",
            });
          }
        } else {
          res.status(200).json({
            error: true,
            message: "Create a password atleast 8 characters long",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Neccessary details missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  updateUserImage: async (req, res, next) => {
    try {
      let userId = req.user._id;
      let image = "";
      let personal = await User.findOne({ _id: req.user._id });
      if (personal) {
        image = personal.image;
        if (!personal.image) {
          image = defaultImage;
        }
        if (req.file) {
          image = `users/${req.file.filename}`;
          // deleting old image
          if (personal.image) {
            if (personal.image != defaultImage) {
              let splittedImageRoute = personal.image.split("/");
              let path = `./public/images/user/${splittedImageRoute[1]}`;
              if (fs.existsSync(path)) {
                fs.unlink(path, function (err) {
                  if (err) throw err;
                });
              }
            }
          }
        }

        User.updateOne({ _id: userId }, { $set: { image: image } })
          .then((response) => {
            if (response.nModified == 1) {
              res.status(200).json({
                error: false,
                message: "Image updated successfully",
              });
            } else {
              res.status(200).json({
                error: true,
                message: "Something went wrong.Please try after some time",
              });
            }
          })
          .catch((error) => {
            res.status(200).json({
              error: true,
              message: error + "",
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid user id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /* User Medical details add /update
    ============================================= */
  addUserMedicalDetails: async (req, res, next) => {
    try {
      let data = req.body;
      console.log(data);
      data.userId = req.user._id;
      let medical = await UserMedical.findOne({ userId: req.user._id });
      if (!medical) {
        let schemaObj = new UserMedical(data);
        schemaObj
          .save()
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Medical details added successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        data.updatedAt = new Date();
        UserMedical.updateOne({ userId: req.user._id }, data)
          .then(async (response) => {
            if (response.nModified == 1) {
              res.status(200).json({
                error: false,
                message: "Medical details updated successfully",
              });
            } else {
              res.status(200).json({
                error: true,
                message: "Something went wrong. Please try after some time.",
              });
            }
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserMedicalDetails: async (req, res, next) => {
    try {
      let result = await UserMedical.findOne(
        {
          userId: mongoose.Types.ObjectId(req.user._id),
        },
        {
          __v: 0,
          isDisabled: 0,
          createdAt: 0,
          updatedAt: 0,
        }
      );

      if (result) {
        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Data not found",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /* User Profile Feedback
    ============================================= */
  addUserProfileFeedback: async (req, res, next) => {
    try {
      let data = req.body;
      data.userId = req.user._id;
      let feedback = await UserProfileFeedback.findOne({
        userId: req.user._id,
      });
      if (!feedback) {
        let schemaObj = new UserProfileFeedback(data);
        schemaObj
          .save()
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Feedback added successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        // res.status(200).json({
        //   error: true,
        //   message: "Feedback already added",
        // });
        UserProfileFeedback.updateOne({ userId: req.user._id }, data)
          .then(async (response) => {
            res.status(200).json({
              error: false,
              message: "Feedback updated successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserProfileFeedback: async (req, res, next) => {
    try {
      // let result = await UserProfileFeedback.findOne(
      //     {
      //         userId: mongoose.Types.ObjectId(req.user._id),
      //     },
      //     {
      //         __v:0,
      //         isDisabled:0
      //     }
      //   );

      let result = await UserProfileFeedback.findOne(
        {
          userId: mongoose.Types.ObjectId(req.user._id),
        },
        {
          reason: 1,
          comment: 1,
          createdDate: {
            $dateToString: { format: "%d-%m-%G", date: "$createdAt" },
          },
        }
      )
        .populate({ path: "userId", select: ["name", "phone", "email"] })
        .lean();

      if (result) {
        result.name = result.userId.name;
        result.mobile = result.userId.phone;
        result.email = result.userId.email;
        delete result.userId;

        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Data not found",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteUserProfileFeedback: async (req, res, next) => {
    try {
      let address = await UserProfileFeedback.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (address) {
        UserProfileFeedback.deleteOne({ _id: req.params.id })
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Feedback deleted successfully.",
            });
          })
          .catch((error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /* User Family details
    ============================================= */
  addUserFamily: async (req, res, next) => {
    try {
      let data = req.body;
      console.log(req.body);
      data.userId = req.user._id;
      if (req.file) {
        data.image = `users/${req.file.filename}`;
        console.log(req.file);
      } else {
        data.image = defaultImage;
      }
      let schemaObj = new UserFamily(data);
      schemaObj
        .save()
        .then((response) => {
          res.status(200).json({
            error: false,
            message: "Family details added successfully",
          });
        })
        .catch(async (error) => {
          res.status(200).json({
            error: true,
            message: error,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  getUserFamily: async (req, res, next) => {
    try {
      let result = await UserFamily.find(
        {
          userId: mongoose.Types.ObjectId(req.user._id),
        },
        {
          name: 1,
          surname: 1,
          gender: 1,
          age: 1,
          bloodGroup: 1,
          relation: 1,
          height: 1,
          weight: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );
      if (result.length) {
        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Data not found",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editUserFamily: async (req, res, next) => {
    try {
      let data = req.body;
      if (data.id) {
        let family = await UserFamily.findOne({
          _id: mongoose.Types.ObjectId(data.id),
        });
        if (family) {
          data.updatedAt = new Date();
          data.image = family.image;
          if (req.file) {
            data.image = `users/${req.file.filename}`;
            // deleting old image
            if (family.image) {
              if (family.image != defaultImage) {
                let splittedImageRoute = family.image.split("/");
                let path = `./public/images/user/${splittedImageRoute[1]}`;
                if (fs.existsSync(path)) {
                  fs.unlink(path, function (err) {
                    if (err) throw err;
                  });
                }
              }
            }
          }
          UserFamily.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, data)
            .then((response) => {
              if (response.nModified == 1) {
                res.status(200).json({
                  error: false,
                  message: "Family details Updated Successfully",
                });
              } else {
                res.status(200).json({
                  error: true,
                  nessage: "Something went wrong. Please try after some time.",
                });
              }
            })
            .catch((error) => {
              res.status(200).json({
                error: true,
                message: error,
              });
            });
        } else {
          res.status(200).json({
            error: true,
            message: "Invalid id",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Please enter id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserFamilyById: async (req, res, next) => {
    try {
      let result = await UserFamily.findOne(
        { _id: mongoose.Types.ObjectId(req.body.id) },
        {
          name: 1,
          surname: 1,
          gender: 1,
          age: 1,
          bloodGroup: 1,
          relation: 1,
          height: 1,
          weight: 1,
          image: { $concat: [imgPath, "$image"] },
        }
      );
      if (result) {
        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Data not found",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteUserFamily: async (req, res, next) => {
    try {
      let family = await UserFamily.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (family) {
        UserFamily.deleteOne({ _id: req.params.id })
          .then(async (response) => {
            if (family.image) {
              if (family.image != defaultImage) {
                let splittedImageRoute = family.image.split("/");
                let path = `./public/images/user/${splittedImageRoute[1]}`;
                if (fs.existsSync(path)) {
                  fs.unlink(path, function (err) {
                    if (err) throw err;
                  });
                }
              }
            }

            let healthVault = await HealthVault.find({
              patientId: mongoose.Types.ObjectId(req.params.id),
            });
            if (healthVault) {
              for (let health of healthVault) {
                console.log("health" + health);
                HealthVault.deleteOne({ _id: health.id })
                  .then((response) => {
                    if (health.prescription) {
                      let splittedImageRoute = health.prescription.split("/");
                      let path = `./public/images/user/${splittedImageRoute[1]}`;
                      if (fs.existsSync(path)) {
                        fs.unlink(path, function (err) {
                          if (err) throw err;
                        });
                      }
                    }
                  })
                  .catch((error) => {
                    res.status(200).json({
                      error: true,
                      message: error,
                    });
                  });
              }
            }

            res.status(200).json({
              error: false,
              message: "Family deleted successfully.",
            });
          })
          .catch((error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /* Health vault
    ============================================= */
  addUserHealthVault: async (req, res, next) => {
    try {
      let data = req.body;
      data.userId = req.user._id;

      const prescriptionTypes = ["Lab Report", "Prescription"];
      if (prescriptionTypes.includes(data.category)) {
        if (req.file) {
          data.prescription = `users/${req.file.filename}`;
        }

        let schemaObj = new HealthVault(data);
        schemaObj
          .save()
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Health vault added successfully",
            });
          })
          .catch(async (error) => {
            let err = error.message;
            res.status(200).json({
              error: true,
              message: err,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid category",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Listing all health vault of user
  getUserHealthVaultByUserId: async (req, res, next) => {
    try {
      // let result = await HealthVault.find(
      //     { userId: mongoose.Types.ObjectId(req.user._id) },
      //     {
      //         patientId:1,
      //         category:1,
      //         prescription: { $concat: [imgPath, "$prescription"] },
      //         date: {$dateToString: {format: "%d-%m-%G",date: "$createdAt"}},
      //     }
      // ).lean()
      // let healthDetails =[]
      // for (let users of result){
      //     if(users.patientId == req.user._id){
      //         let user = await User.findOne(
      //             { _id: mongoose.Types.ObjectId(req.user._id) },
      //             {
      //                 name:1,
      //             }
      //         )
      //         users.name = user.name
      //         healthDetails.push(users)
      //     }
      //     else{
      //         let user = await UserFamily.findOne(
      //             { _id: mongoose.Types.ObjectId(users.patientId) },
      //             {
      //                 name: { $concat: ["$name"," ","$surname"] }
      //             }
      //         )
      //         console.log(user)
      //         users.name =user.name
      //         healthDetails.push(users)
      //     }
      // }
      let result = await HealthVault.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(req.user._id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "userfamilies",
            localField: "patientId",
            foreignField: "_id",
            as: "family",
          },
        },
        {
          $project: {
            patientId: 1,
            category: 1,
            prescription: { $concat: [imgPath, "$prescription"] },
            date: { $dateToString: { format: "%d-%m-%G", date: "$createdAt" } },
            patientName: {
              $ifNull: [{ $first: "$family.name" }, { $first: "$user.name" }],
            },
          },
        },
      ]);
      if (result) {
        res.status(200).json({
          error: false,
          message: "success",
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Data not found",
          data: [],
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getUserHealthVaultById: async (req, res, next) => {
    try {
      // let result = await HealthVault.findOne(
      //     { _id: mongoose.Types.ObjectId(req.params.id) },
      //     {
      //         patientName:1,
      //         category:1,
      //         prescription: { $concat: [imgPath, "$prescription"] }
      //     }
      // );
      let result = await HealthVault.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "userfamilies",
            localField: "patientId",
            foreignField: "_id",
            as: "family",
          },
        },
        {
          $project: {
            patientId: 1,
            category: 1,
            prescription: { $concat: [imgPath, "$prescription"] },
            date: { $dateToString: { format: "%d-%m-%G", date: "$createdAt" } },
            patientName: {
              $ifNull: [{ $first: "$family.name" }, { $first: "$user.name" }],
            },
          },
        },
      ]);
      if (result) {
        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },

  editUserHealthVault: async (req, res, next) => {
    try {
      let data = req.body;
      if (data.id) {
        let healthVault = await HealthVault.findOne({
          _id: mongoose.Types.ObjectId(data.id),
        });
        if (healthVault) {
          const prescriptionTypes = ["Lab Report", "Prescription"];
          if (prescriptionTypes.includes(data.category)) {
            data.updatedAt = new Date();
            data.prescription = healthVault.prescription;
            if (req.file) {
              data.prescription = `users/${req.file.filename}`;
              // deleting old image
              if (healthVault.prescription) {
                let splittedImageRoute = healthVault.prescription.split("/");
                let path = `./public/images/user/${splittedImageRoute[1]}`;
                if (fs.existsSync(path)) {
                  fs.unlink(path, function (err) {
                    if (err) throw err;
                  });
                }
              }
            }
            HealthVault.updateOne(
              { _id: mongoose.Types.ObjectId(data.id) },
              data
            )
              .then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    error: false,
                    message: "Health vault Updated Successfully",
                  });
                } else {
                  res.status(200).json({
                    error: true,
                    nessage:
                      "Something went wrong. Please try after some time.",
                  });
                }
              })
              .catch((error) => {
                res.status(200).json({
                  error: true,
                  message: error.message,
                });
              });
          } else {
            res.status(200).json({
              error: true,
              message: "Invalid category",
            });
          }
        } else {
          res.status(200).json({
            error: true,
            message: "Invalid id",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "Please enter id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteUserHealthVault: async (req, res, next) => {
    try {
      let healthVault = await HealthVault.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (healthVault) {
        HealthVault.deleteOne({ _id: req.params.id })
          .then((response) => {
            if (healthVault.prescription) {
              let splittedImageRoute = healthVault.prescription.split("/");
              let path = `./public/images/user/${splittedImageRoute[1]}`;
              if (fs.existsSync(path)) {
                fs.unlink(path, function (err) {
                  if (err) throw err;
                });
              }
            }

            res.status(200).json({
              error: false,
              message: "Health Vault deleted successfully.",
            });
          })
          .catch((error) => {
            res.status(200).json({
              error: true,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getUserNamesByUserId: async (req, res, next) => {
    try {
      let user = await User.find(
        {
          _id: mongoose.Types.ObjectId(req.user._id),
        },
        {
          name: 1,
        }
      );
      let userFamily = await UserFamily.find(
        {
          userId: mongoose.Types.ObjectId(req.user._id),
        },
        {
          //name: { $concat: ["$name"," ","$surname"] }
          name: 1,
        }
      );

      let result = [...user, ...userFamily];

      if (result.length) {
        res.status(200).json({
          message: "success",
          error: false,
          data: result,
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Data not found",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  },

  addUserPrescriptions: async (req, res, next) => {
    try {
      console.log(req.body);

      let data = {
        userId: req.user._id,
        active: true,
        prescription: req.body.prescription,
      };
      let obj = new Prescription(data);
      obj.save().then((_) => {
        Prescription.updateMany(
          { _id: { $nin: obj._id }, userId: req.user._id },
          { active: false }
        ).then((response) => {
          console.log(response);
        });
        res.status(200).json({
          error: false,
          message: "Prescription added successfully.",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  addUserPrescriptionsImage: async (req, res, next) => {
    try {
      let images = [];
      if (req.files?.prescription) {
        for (let item of req.files.prescription) {
          let obj = `${imgPath}users/${item.filename}`;
          images.push(obj);
        }
        res.status(200).json({
          error: false,
          message: "Prescription image upload successfully.",
          data: {
            images,
          },
        });
      } else {
        res.status(200).json({
          error: false,
          message: "Please upload image",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserPrescription: async (req, res, next) => {
    try {
      let result = await Prescription.findOne(
        {
          userId: req.user._id,
          active: true,
        },
        {
          prescription: 1,
        }
      );
      if (result) {
        if (!result.prescription) {
          result.prescription = [];
        }
      }
      if (!result) {
        result = {};
      }
      res.status(200).json({
        error: false,
        message: "Success",
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  updateUserPrescriptions: async (req, res, next) => {
    try {
      let existing = await Prescription.findOne({ _id: req.params.id });
      if (existing) {
        let data = {
          userId: req.user._id,
          active: true,
          prescription: req.body.prescription,
        };

        await Prescription.updateOne({ _id: req.params.id }, data).then(() => {
          res.status(200).json({
            error: false,
            message: "Prescription updated successfully.",
          });
        });
      } else {
        res.status(200).json({
          error: true,
          message: "Invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  addUserPrescriptionAdmin: async (req, res, next) => {
    try {
      let images = [];

      // if (req.files?.prescription) {
      //   for (let item of req.files.prescription) {
      //     let obj = `users/${item.filename}`;
      //     images.push(obj);
      //   }
      //   let lgth =images.length
      //   let data = {
      //     userId: req.user._id,
      //     active: true,
      //     isConsult:false,
      //     prescription: images,
      //   };
      //   let prescriptions = new UserPrescriptionAdmin(data);
      //   prescriptions.save().then((_) => {
      //    return res.status(200).json({
      //       error: false,
      //       message: `${lgth} Prescription added successfully.`,
      //     });
      //   });
      // }else{
      let data = {
        userId: req.user._id,
        active: true,
        isConsult: true,
        prescription: req.body.prescription,
      };
      let prescriptions = new UserPrescriptionAdmin(data);
      prescriptions.save().then((_) => {
        return res.status(200).json({
          error: false,
          message: "Prescription added successfully.",
        });
      });
      // }
    } catch (error) {
      next(error);
    }
  },
  getUserPrescriptionAdmin: async (req, res, next) => {
    try {
      let result = await UserPrescriptionAdmin.find({
        userId: req.user._id,
        active: true,
      });
      // if (result) {
      //   for(let item of result){
      //     let tempArr = []
      //     for(let i of item?.prescription ){
      //       tempArr.push(process.env.BASE_URL+i)
      //     }
      //     item.prescription = tempArr
      //   }
      //   // if (!result.prescription) {
      //   //   result.prescription = [];
      //   // }
      // }
      if (!result) {
        result = {};
      }
      res.status(200).json({
        error: false,
        message: "Success",
        data: {
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  deleteUserPrescriptionAdmin: async (req, res, next) => {
    try {
      let result = await UserPrescriptionAdmin.findOne({
        userId: req.user._id,
        _id: req.body.id,
      });
      if (result) {
        UserPrescriptionAdmin.deleteOne({
          userId: req.user._id,
          _id: req.body.id,
        })
          .then((response) => {
            res.status(200).json({
              error: false,
              message: "Success",
            });
          })
          .catch((err) => {
            res.status(422).json({
              error: true,
              message: err,
            });
          });
      } else {
        res.status(422).json({
          error: true,
          message: "something went wrong",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
