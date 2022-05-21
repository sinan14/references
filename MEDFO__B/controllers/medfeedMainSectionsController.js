const mongoose = require("mongoose");
const medfeedMainSections = require("../models/medfeedMainSection");

module.exports = {
  addSection: async (req, res, next) => {
    try {
      if (req.file) {
        let existing = await medfeedMainSections.findOne({
          name: req.body.name
        });

        if (!existing) {
          let data = {
            name: req.body.name,
          };

          data.image = `medfeed/${req.file.filename}`;

          let schemaObj = medfeedMainSections(data)
          schemaObj.save().then((response) => {
              res.status(200).json({
                  error: false,
                  message: 'section added successfully'
              })
          })

        } else {
          res.status(200).json({
            error: true,
            message: "existing section",
          });
        }
      } else {
        res.status(200).json({
          error: true,
          message: "image missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
