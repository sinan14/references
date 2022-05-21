export default class Employee {
    firstname: String;
    lastname: String;
    employeeId: String;
    department: String;

    dob: {
      type: String,
      description: "Date of Birth of employee",
    };
    workEmail: {
      type: String,
      lowercase: true,
      description: "Work Email of employee",
    };
    password: {
      type: String,
      minLength: [6, "Password is too short!"],
      description: "Login Password of employee",
      required: true,
    };
    signature: {
      type: String,
      description: "Signature of employee",
    };
    photo: {
      type: String,
      description: "Photo of employee",
    };
    gender: {
      type: String,
      description: "Gender of employee",
    };
    designation: {
      type: String,
      required: [true, "What is your Designation?"],
      description: "Designation of employee",
    };
    workLocation: {
      type: String,
      description: "Employee work Location",
    };
    contactNumber: {
      type: Number,
      description: "Employee Contact Number",
      required: [true, "What is your contact number?"],
      min: 9,
    };
    active: {
      type: Boolean,
      default: true,
      select: false,
    };
    personal: {
      fatherName: {
        type: String,
        description: "Name of Father",
      };
      personalEmail: {
        type: String,
        description: "Employee Personal Email",
      };
      panNo: {
        type: String,
        description: "Employee PAN Number",
      };
      bloodGroup: {
        type: String,
        description: "Employee Blood Group",
      };
      pincode: {
        type: String,
        description: "PIN Code",
      };
      aadharNo: {
        type: String,
        description: "Employee Adhar Number",
      };
      address: {
        type: String,
        description: "Employee Address",
      };
      emergencyNo: {
        type: String,
        description: "Emergency Number",
      };
      contactName: {
        type: String,
        description: "Contact Name",
      };
      aadhar: {
        type: String,
        description: "Employee Adhar",
      };
      employeeIdCard: {
        type: String,
        description: "Employee ID Card",
      };
      offerLetter: {
        type: String,
        description: "Employee Offer Letter",
      };
      panCard: {
        type: String,
        description: "Employee PAN Card",
      };
      passbook: {
        type: String,
        description: "Employee passbook",
      };
    };
    paymentAndSalary: {
      annualCtc: {
        type: Number,
      };
      monthlyCtc: {
        type: Number,
      };
      addings: {
        basicsalary: {
          type: Number,
        };
        da: {
          type: Number,
        };
        hra: {
          type: Number,
        };
        ta: {
          type: Number,
        };
        foodCoupon: {
          type: String,
        };
        bonus: {
          type: String,
        };
        ctc: {
          type: String,
        };
      };
      deductions: {
        hraAdvancePaid: {
          type: Number,
        };
        foodCouponAdvancePaid: {
          type: Number,
        };
        pf: {
          type: Number,
        };
        ebi: {
          type: Number,
        };
        totalDeduction: {
          type: Number,
        };
      };
      salarydate: {
        type: String,
      };
      grosspay: {
        type: Number,
      };
      netpay: {
        type: Number,
      };
    };
    bankDetails: {
      accountNumber: {
        type: String,
      };
      confirmAccountNumber: {
        type: String,
      };
      accountHolderName: {
        type: String,
      };
      ifscCode: {
        type: String,
      };
      branchName: {
        type: String,
      };
      micrCode: {
        type: String,
      };
    };
    
    permissions: [
        {
            name: {
                type: String,
            };
            view: {
                type: Boolean,
            };
            edit: {
                type: Boolean,
            };
            delete: {
                type: Boolean,
            };
            _id: false
        }
    ]
  }
  