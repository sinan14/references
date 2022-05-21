const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Name is too short!"],
    maxLength: 150,
    description: "First name of the employee",
  },
  lastname: {
    type: String,
    trim: true,
    description: "Last name of the employee",
  },
  employeeId: {
    type: String,
    minLength: [4, "EmployeeID is too short!"],
    description: "A unique identifier for an employee",
  },
  department: {
    type: String,
    required: [true,"Please add department id"]
  },
  dob: {
    type: String,
    description: "Date of Birth of employee",
  },
  workEmail: {
    type: String,
    lowercase: true,
    description: "Work Email of employee",
  },
  password: {
    type: String,
    minLength: [6, "Password is too short!"],
    description: "Login Password of employee",
    required: true,
  },
  isAdmin: {
    type: Boolean
  },
  signature: {
    type: String,
    description: "Signature of employee",
  },
  photo: {
    type: String,
    description: "Photo of employee",
  },
  gender: {
    type: String,
    description: "Gender of employee",
  },
  designation: {
    type: String,
    required: [true, "What is your Designation?"],
    description: "Designation of employee",
  },
  workLocation: {
    type: String,
    description: "Employee work Location",
  },
  contactNumber: {
    type: Number,
    description: "Employee Contact Number",
    required: [true, "What is your contact number?"],
    min: 9,
  },
  employeeType: {
    type: mongoose.Types.ObjectId,
    ref: 'EmployeeTypes'
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  personal: {
    fatherName: {
      type: String,
      description: "Name of Father",
    },
    personalEmail: {
      type: String,
      description: "Employee Personal Email",
    },
    panNo: {
      type: String,
      description: "Employee PAN Number",
    },
    bloodGroup: {
      type: String,
      description: "Employee Blood Group",
    },
    pincode: {
      type: String,
      description: "PIN Code",
    },
    aadharNo: {
      type: String,
      description: "Employee Adhar Number",
    },
    address: {
      type: String,
      description: "Employee Address",
    },
    emergencyNo: {
      type: String,
      description: "Emergency Number",
    },
    contactName: {
      type: String,
      description: "Contact Name",
    },
    aadhar: {
      type: String,
      description: "Employee Adhar",
    },
    employeeIdCard: {
      type: String,
      description: "Employee ID Card",
    },
    offerLetter: {
      type: String,
      description: "Employee Offer Letter",
    },
    panCard: {
      type: String,
      description: "Employee PAN Card",
    },
    passbook: {
      type: String,
      description: "Employee passbook",
    },
    others: {
      type: String,
      description: "other details",
    },
  },
  paymentAndSalary: {
    annualCtc: {
      type: Number,
    },
    monthlyCtc: {
      type: Number,
    },
    addings: {
      basicSalary: {
        type: Number,
      },
      da: {
        type: Number,
      },
      hra: {
        type: Number,
      },
      ta: {
        type: Number,
      },
      foodCoupon: {
        type: String,
      },
      bonus: {
        type: String,
      },
      ctc: {
        type: String,
      },
    },
    deductions: {
      hraAdvancePaid: {
        type: Number,
      },
      foodCouponAdvancePaid: {
        type: Number,
      },
      pf: {
        type: Number,
      },
      ebi: {
        type: Number,
      },
      totalDeduction: {
        type: Number,
      },
    },
    salaryDate: {
      type: String,
    },
    grosspay: {
      type: Number,
    },
    netpay: {
      type: Number,
    },
  },
  bankDetails: {
    accountNumber: {
      type: String,
    },
    confirmAccountNumber: {
      type: String,
    },
    accountHolderName: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    branchName: {
      type: String,
    },
    micrCode: {
      type: String,
    },
  },
  notes: [
    {
      note: {
        content: {
          type: String,
        },
        date: {
          type: String,
        },
        noted_by: {
          type: mongoose.Types.ObjectId
        }
      },
    },
  ],
  permissions: [
      {
          name: {
              type: String,
          },
          head: {
            type: String
          },
          subOf: {
            type: String
          },
          view: {
              type: Boolean,
          },
          edit: {
              type: Boolean,
          },
          all: {
              type: Boolean,
          },
          _id: false
      }
  ],
  createdAt: {
      type: Date,
      required: false
  },
  updatedAt: {
    type: Date,
    required: false
  }
});

EmployeeSchema.pre("save", async function (next) {
    now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now.getTime();

    // check the password if it is modified
    if (!this.isModified("password")) {
        return next();
    }

    // Hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
