const mongoose = require("mongoose");
const fs = require("fs");
const moment = require("moment");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const imgPath = process.env.BASE_URL;
const Doctor = require("../../models/doctor/doctor");
const doctorEmailHelper = require("../../helpers/doctorEmailHelper");

module.exports = {
  addDoctorDetails: async (req, res, next) => {
    try {
      let existingEmail = await Doctor.findOne({
        email: req.body.email,
      });
      if (!existingEmail) {
        let existingMobile = await Doctor.findOne({
          mobile: req.body.mobile,
        });
        if (!existingMobile) {
          let details = req.body;
          if (req.files.aadhar) {
            details.aadhar = `doctor/${req.files.aadhar[0].filename}`;
          }
          if (req.files.voterId) {
            details.voterId = `doctor/${req.files.voterId[0].filename}`;
          }
          if (req.files.medicalRegCertificate) {
            details.medicalRegCertificate = `doctor/${req.files.medicalRegCertificate[0].filename}`;
          }
          if (req.files.establishmentProof) {
            details.establishmentProof = `doctor/${req.files.establishmentProof[0].filename}`;
          }

          let existingDoctor = await Doctor.findOne({}).sort({ _id: -1 });
          if (!existingDoctor) {
            details.doctorId = "DOCTOR-1000";
          } else {
            if (existingDoctor.doctorId) {
              let lastInsertedDoctorId = existingDoctor.doctorId;
              // get everything after first dash
              const doctorId = lastInsertedDoctorId.substring(
                lastInsertedDoctorId.indexOf("-") + 1
              );
              intDoctorId = parseInt(doctorId);
              details.doctorId = "DOCTOR-" + (intDoctorId + 1);
            }
          }
          let schemaObj = new Doctor(details);
          schemaObj
            .save()
            .then((response) => {
              let toMail = req.body.email;
              let name = req.body.name;
              doctorEmailHelper.sendEmail(toMail, name).then((response) => {
                if (response) {
                  isEmailSend = true;
                } else {
                  isEmailSend = false;
                }
              });

              res.status(200).json({
                status: true,
                data: {
                  message: "Doctor details added successfully.",
                  response: response,
                },
              });
            })
            .catch(async (error) => {
              if (req.files.aadhar) {
                await unlinkAsync(req.files.aadhar[0].path);
              }
              if (req.files.voterId) {
                await unlinkAsync(req.files.voterId[0].path);
              }
              if (req.files.medicalRegCertificate) {
                await unlinkAsync(req.files.medicalRegCertificate[0].path);
              }
              if (req.files.establishmentProof) {
                await unlinkAsync(req.files.establishmentProof[0].path);
              }
              res.status(200).json({
                status: false,
                data: error,
              });
            });
        } else {
          if (req.files.aadhar) {
            await unlinkAsync(req.files.aadhar[0].path);
          }
          if (req.files.voterId) {
            await unlinkAsync(req.files.voterId[0].path);
          }
          if (req.files.medicalRegCertificate) {
            await unlinkAsync(req.files.medicalRegCertificate[0].path);
          }
          if (req.files.establishmentProof) {
            await unlinkAsync(req.files.establishmentProof[0].path);
          }
          res.status(200).json({
            status: false,
            message: "Mobile number already exist",
            data: {},
          });
        }
      } else {
        if (req.files.aadhar) {
          await unlinkAsync(req.files.aadhar[0].path);
        }
        if (req.files.voterId) {
          await unlinkAsync(req.files.voterId[0].path);
        }
        if (req.files.medicalRegCertificate) {
          await unlinkAsync(req.files.medicalRegCertificate[0].path);
        }
        if (req.files.establishmentProof) {
          await unlinkAsync(req.files.establishmentProof[0].path);
        }
        res.status(200).json({
          status: false,
          message: "Email id already exist",
          data: {},
        });
      }
    } catch (error) {
      if (req.files.aadhar) {
        await unlinkAsync(req.files.aadhar[0].path);
      }
      if (req.files.voterId) {
        await unlinkAsync(req.files.voterId[0].path);
      }
      if (req.files.medicalRegCertificate) {
        await unlinkAsync(req.files.medicalRegCertificate[0].path);
      }
      if (req.files.establishmentProof) {
        await unlinkAsync(req.files.establishmentProof[0].path);
      }
      next(error);
    }
  },

  getPendingDoctorDetails: async (req, res, next) => {
    try {
      let result = await Doctor.find(
        { isVerified: false, isApproved: "pending" },
        {
          name: 1,
          mobile: 1,
          email: 1,
          createdDate: {
            $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
          },
        }
      ).sort({ $natural: -1 });
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getVerifiedDoctorDetails: async (req, res, next) => {
    try {
      let result = await Doctor.find(
        { isVerified: true, isApproved: "pending" },
        {
          name: 1,
          mobile: 1,
          email: 1,
        }
      ).sort({ updatedAt: -1 });

      //.sort({ $natural: -1 })

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // status changed for doctor verification
  changeDoctorVerificationStatus: async (req, res, next) => {
    try {
      let data = {};
      let result = await Doctor.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });
      if (result) {
        data.updatedAt = new Date();
        data.isVerified = req.body.status;
        Doctor.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, data)
          .then((response) => {
            if (response.nModified == 1) {
              res.status(200).json({
                status: true,
                data: "Doctor verification status changed successfully",
              });
            } else {
              res.status(200).json({
                status: false,
                data: "Something went wrong. Please try after some time",
              });
            }
          })
          .catch((error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          data: "Invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // status changed for doctor approval or rejection
  changeDoctorApproveStatus: async (req, res, next) => {
    try {
      let data = {};
      const status = ["approved", "rejected"];
      if (status.includes(req.body.status)) {
        let result = await Doctor.findOne({
          _id: mongoose.Types.ObjectId(req.body.id),
        });
        if (result) {
          data.updatedAt = new Date();
          data.isApproved = req.body.status;
          let isVerified = await Doctor.findOne({
            _id: mongoose.Types.ObjectId(req.body.id),
            isVerified: true,
          });
          if (isVerified) {
            Doctor.updateOne(
              { _id: mongoose.Types.ObjectId(req.body.id) },
              data
            )
              .then((response) => {
                if (response.nModified == 1) {
                  if (req.body.status == "approved") {
                    res.status(200).json({
                      status: true,
                      data: "Doctor approved successfully",
                    });
                  } else {
                    res.status(200).json({
                      status: true,
                      data: "Doctor rejected successfully",
                    });
                  }
                } else {
                  res.status(200).json({
                    status: false,
                    data: "Something went wrong. Please try after some time",
                  });
                }
              })
              .catch((error) => {
                res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          } else {
            res.status(200).json({
              status: false,
              data: "Doctor is not verified.",
            });
          }
        } else {
          res.status(200).json({
            status: false,
            data: "Invalid id",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Invalid status",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Get approved doctor details
  getApprovedDoctorDetails: async (req, res, next) => {
    try {
      let result = await Doctor.find(
        { isApproved: "approved", isVerified: true },
        {
          name: 1,
          mobile: 1,
          email: 1,
          isVerified: 1,
          isApproved: 1,
        }
      ).sort({ updatedAt: -1 });
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get rejected doctor details
  getRejectedDoctorDetails: async (req, res, next) => {
    try {
      let result = await Doctor.find(
        { isApproved: "rejected", isVerified: true },
        {
          name: 1,
          mobile: 1,
          email: 1,
        }
      ).sort({ updatedAt: -1 });
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // get doctor details by id
  getDoctorDetailsById: async (req, res, next) => {
    try {
      let result = await Doctor.find(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          name: 1,
          mobile: 1,
          email: 1,
          alternativeNumber: 1,
          landNumber: 1,
          residentialAddress: 1,
          registrationNumber: 1,
          registeredCouncil: 1,
          registeredYear: 1,
          qualification: 1,
          establishmentName: 1,
          establishmentCity: 1,
          establishmentLocality: 1,
          workingFrom: 1,
          experienceYear: 1,
          aadhar: { $concat: [imgPath, "$aadhar"] },
          voterId: { $concat: [imgPath, "$voterId"] },
          establishmentProof: { $concat: [imgPath, "$establishmentProof"] },
          medicalRegCertificate: {
            $concat: [imgPath, "$medicalRegCertificate"],
          },
          isApproved: 1,
          isVerified: 1,
          isActive: 1,
          createdDate: {
            $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
          },
        }
      );
      if (result.length != 0) {
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // // get doctor details by date
  // getDoctorDetailsByDate: async (req, res, next) => {
  //     try {
  //         // let count = 0
  //         let startDate = new Date(req.body.startDate);
  //         let endDate = new Date(req.body.endDate);
  //         let result = await Doctor
  //             .find(
  //                 { createdAt: { $gte: startDate, $lte: endDate } },
  //                 {
  //                     name :1,
  //                     email:1,
  //                     status:"$isApproved",
  //                     verificationStatus:"$isVerified"

  //                 }
  //                 )
  //             .lean();
  //             let finalResult = result.reverse()

  //             // for(let item of finalResult){
  //             //     count++
  //             //     item.sl = count
  //             // }
  //         // .limit(limit)
  //         //     .skip(skip)
  //         res.status(200).json({
  //             error: false,
  //             data: finalResult,
  //         });
  //     } catch (error) {
  //         next(error);
  //     }
  // },
  // get doctor details by date
  getDoctorDetailsByDate: async (req, res, next) => {
    try {
      // let startDate = new Date(req.body.startDate);
      // let endDate = new Date(req.body.endDate);
      let startDate = moment(req.body.startDate)
        .tz(process.env.TIME_ZONE)
        .set({ h: 00, m: 00, s: 00 })
        .utc();
      let endDate = moment(req.body.endDate)
        .tz(process.env.TIME_ZONE)
        .set({ h: 23, m: 59, s: 59 })
        .utc();

      let result = [];
      const status = ["approved", "rejected", "pending", "verified"];
      if (status.includes(req.body.status)) {
        if (req.body.status == "verified") {
          result = await Doctor.find(
            {
              $and: [
                { createdAt: { $gte: startDate } },
                { createdAt: { $lte: endDate } },
              ],
              isApproved: "pending",
              isVerified: true,
            },
            {
              name: 1,
              email: 1,
              mobile: 1,
              status: "$isApproved",
              verificationStatus: "$isVerified",
            }
          ).lean();
        } else if (req.body.status == "pending") {
          // result = await Doctor.find(
          //     { createdAt: { $gte: startDate, $lte:endDate }, isVerified: false, isApproved: "pending" },
          //     {
          //         name: 1,
          //         email: 1,
          //         mobile:1,
          //         status: "$isApproved",
          //         verificationStatus: "$isVerified",
          //         createdAt:1
          //     }
          // ).lean();
          result = await Doctor.find(
            {
              $and: [
                { createdAt: { $gte: startDate } },
                { createdAt: { $lte: endDate } },
              ],
              isApproved: "pending",
              isVerified: false,
            },
            {
              name: 1,
              email: 1,
              mobile: 1,
              status: "$isApproved",
              verificationStatus: "$isVerified",
            }
          ).lean();
        } else if (req.body.status == "approved") {
          result = await Doctor.find(
            {
              $and: [
                { createdAt: { $gte: startDate } },
                { createdAt: { $lte: endDate } },
              ],
              isApproved: "approved",
              isVerified: true,
            },
            {
              name: 1,
              email: 1,
              mobile: 1,
              status: "$isApproved",
              verificationStatus: "$isVerified",
            }
          ).lean();
        } else if (req.body.status == "rejected") {
          result = await Doctor.find(
            {
              $and: [
                { createdAt: { $gte: startDate } },
                { createdAt: { $lte: endDate } },
              ],
              isApproved: "rejected",
              isVerified: true,
            },
            {
              name: 1,
              email: 1,
              mobile: 1,
              status: "$isApproved",
              verificationStatus: "$isVerified",
            }
          ).lean();
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Invalid status",
        });
      }

      let finalResult = result.reverse();

      res.status(200).json({
        status: true,
        data: finalResult,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteDoctorDetails: async (req, res, next) => {
    try {
      let doctor = await Doctor.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (doctor) {
        Doctor.deleteOne({ _id: req.params.id })
          .then((response) => {
            // let splittedImageRoute = Doctor.aadhar.split("/");

            // fs.unlink(`./public/images/doctor/${splittedImageRoute[1]}`, function (err) {
            //     if (err) throw err;
            // });
            // let splittedmcRoute = Doctor.medicalRegCertificate.split("/");

            // fs.unlink(`./public/images/doctor/${splittedmcRoute[1]}`, function (err) {
            //     if (err) throw err;
            // });

            // let splittedvoterRoute = Doctor.voterId.split("/");

            // fs.unlink(`./public/images/doctor/${splittedvoterRoute[1]}`, function (err) {
            //     if (err) throw err;
            // });

            res.status(200).json({
              status: true,
              data: "Doctor deleted successfully",
            });
          })
          .catch((error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getAllDoctorDetails: async (req, res, next) => {
    try {
      let result = await Doctor.find({}).sort({ $natural: -1 });
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
