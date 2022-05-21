const PDFDocument = require("pdfkit");
const uniqid = require("uniqid");
const moment = require("moment-timezone");
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const appRoot = require("app-root-path");
const pdf2img = require("gix-pdf2img");

const generatePrescriptionPDFAndImages = (
  { doctorName, medicalDegree },
  { patientName, ageAndGender },
  allergies,
  diagnosis,
  diagnosisTest = "Not Applicable",
  products,
  termsAndConditions,
  signatureImage
) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if folders exist if not create

      const publicFolder = existsSync(`${appRoot.path}/public`);
      if (!publicFolder) mkdirSync(`${appRoot.path}/public`);

      const prescriptionFolder = existsSync(
        `${appRoot.path}/public/prescriptions`
      );
      if (!prescriptionFolder)
        mkdirSync(`${appRoot.path}/public/prescriptions`);

      const pdfFolder = existsSync(`${appRoot.path}/public/prescriptions/pdf`);
      if (!pdfFolder) mkdirSync(`${appRoot.path}/public/prescriptions/pdf`);

      const imageFolder = existsSync(
        `${appRoot.path}/public/prescriptions/images`
      );
      if (!imageFolder)
        mkdirSync(`${appRoot.path}/public/prescriptions/images`);

      const fileName = `prescription_${uniqid.process()}_${new Date().getTime()}.pdf`;

      const PDFPath = `${appRoot.path}/public/prescriptions/pdf/${fileName}`;
      const registrationNo = new Date().getTime();

      const checkHeightAndDecideElementPosition = (
        cursorPosition,
        difference
      ) => {
        //difference is the difference you want to add for your next element

        let newPosition = cursorPosition + difference;

        if (newPosition > 721) {
          doc.addPage();
          newPosition = 10 + difference;
        }

        return newPosition;
      };

      const doc = new PDFDocument({
        size: "A4",
        layout: "portrait",
        margin: 15,
      });

      const stream = doc.pipe(createWriteStream(PDFPath));

      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");

      const maxWidth = 87.85;
      const maxHeight = 45;

      doc.image(`${__dirname}/blue-logo-one.png`, {
        fit: [maxWidth, maxHeight],
        align: "center",
      });

      doc.moveUp(3);

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(14)
        .fill("#000000")
        .text(doctorName, {
          align: "right",
        });

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(14)
        .fill("#000000")
        .text(medicalDegree, {
          align: "right",
        });

      doc.moveDown(0.5);

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(10)
        .fill("#000000")
        .opacity(0.5)
        .text(`Registration No : ${registrationNo}`, {
          align: "right",
        });

      doc.moveTo(20, 90).lineTo(575, 90).dash(3, { space: 3 }).stroke();

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(10)
        .fill("#000000")
        .opacity(1)
        .text(`Name : ${patientName} `, 20, 100);
      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(10)
        .fill("#000000")
        .opacity(1)
        .text(
          `Date : ${moment().tz("Asia/Kolkata").format("DD MMM YYYY")}`,
          {
            width: 550,

            align: "right",
          },
          100
        );

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(10)
        .fill("#000000")
        .opacity(1)
        .text(`Age / Gender : ${ageAndGender}`, 20, 120);

      //line
      doc.lineWidth(1.5);
      doc.fillAndStroke("#000000");
      doc.strokeOpacity(0.5);

      doc.moveTo(20, 150).lineTo(575, 150).dash(3, { space: 3 }).stroke();

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(12)
        .fill("#000000")
        .opacity(1)
        .text("Allergies", 20, 160);

      if (allergies === "Not applicable") {
        doc
          .lineCap("square")
          .stroke()
          .fill("#000000")
          .fontSize(8)
          .text(`*${allergies}*`, 25, 185, { width: 500 });
      } else {
        doc
          .lineCap("square")
          .circle(25, 190, 3)
          .fill("#00aaff")
          .stroke()
          .fill("#000000")
          .fontSize(8)
          .text(allergies, 35, 185, { width: 500 });
      }

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(12)
        .fill("#000000")
        .opacity(1)
        .text("Diagnosis", 20, checkHeightAndDecideElementPosition(doc.y, 10));

      if (diagnosis === "Not applicable") {
        doc
          .lineCap("square")
          .stroke()
          .fill("#000000")
          .fontSize(8)
          .text(
            `*${diagnosis}*`,
            25,
            checkHeightAndDecideElementPosition(doc.y, 15),
            {
              align: "justify",
              width: 500,
            }
          );
      } else {
        doc
          .lineCap("square")
          .circle(25, checkHeightAndDecideElementPosition(doc.y, 15), 3)
          .fill("#00aaff")
          .stroke()
          .fill("#000000")
          .fontSize(8)
          .text(diagnosis, 35, checkHeightAndDecideElementPosition(doc.y, 10), {
            align: "justify",
            width: 500,
          });
      }

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(12)
        .fill("#000000")
        .opacity(1)
        .text(
          "Diagnostic Test",
          20,
          checkHeightAndDecideElementPosition(doc.y, 10)
        );
      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(8)
        .fill("#000000")
        .opacity(1)
        .text(
          diagnosisTest === "Not applicable"
            ? "*Not applicable*"
            : diagnosisTest,
          20,
          checkHeightAndDecideElementPosition(doc.y, 10),
          {
            width: 500,
          }
        );

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(12)
        .fill("#000000")
        .opacity(1)
        .text(
          "Prescription",
          20,
          checkHeightAndDecideElementPosition(doc.y, 10)
        );

      doc
        .moveTo(30, checkHeightAndDecideElementPosition(doc.y, 15))
        .lineTo(560, checkHeightAndDecideElementPosition(doc.y, 15))
        .dash(1000)
        .lineWidth(20)
        .fillAndStroke("#00aaff")
        .stroke()
        .fill("#fff")
        .fontSize(10)
        .text("sl.", 40, checkHeightAndDecideElementPosition(doc.y, 8))
        .text(
          "Medicine Name",
          90,
          checkHeightAndDecideElementPosition(doc.y, -15)
        )
        .text("Freq. ", 320, checkHeightAndDecideElementPosition(doc.y, -15))
        .text("Duration ", 400, checkHeightAndDecideElementPosition(doc.y, -15))
        .text(
          "Instructions ",
          {
            width: 150,
            align: "right",
          },
          checkHeightAndDecideElementPosition(doc.y, -15)
        );

      products.map((product, i) => {
        doc
          .font(`${__dirname}/Poppins-Regular.ttf`)
          .fontSize(12)
          .fill("#000000")
          .opacity(1)
          .fontSize(8)
          .text(
            `${i + 1}.`,
            40,
            checkHeightAndDecideElementPosition(doc.y, 10)
          );

        doc.text(
          product.name,

          90,
          checkHeightAndDecideElementPosition(doc.y, -12),
          {
            width: 200,
          }
        );

        doc.text(
          product.freq,

          320,
          checkHeightAndDecideElementPosition(doc.y, -12),
          {
            width: 100,
          }
        );
        doc.text(
          product.duration,

          400,
          checkHeightAndDecideElementPosition(doc.y, -12),
          {
            width: 100,
          }
        );
        doc.text(
          product.instructions,

          490,
          checkHeightAndDecideElementPosition(doc.y, -12),
          {
            width: 100,
          }
        );

        doc.moveDown(0.5);
      });

      doc
        .fontSize(10)
        .opacity(0.9)
        .text(
          "***** Note: Substitution allowed as per terms and conditions *****",
          20,
          checkHeightAndDecideElementPosition(doc.y, 10),
          {
            align: "center",
          }
        );

      let diff = checkHeightAndDecideElementPosition(doc.y, 15);

      doc
        .moveTo(20, diff)
        .lineWidth(1)
        .lineTo(575, diff)
        .dash(3, { space: 3 })
        .stroke("#000000");

      //logo powered by

      doc.image(
        `${__dirname}/blue-logo.png`,
        545,
        checkHeightAndDecideElementPosition(doc.y, 30),
        {
          fit: [30, 30],
          align: "center",
        }
      );

      doc
        .fontSize(10)
        .opacity(0.5)
        .text(
          "Powered By",
          480,
          checkHeightAndDecideElementPosition(doc.y, 30)
        );

      //disclaimer and terms and conditions

      diff = checkHeightAndDecideElementPosition(doc.y, 15);

      doc.fontSize(8).opacity(0.5).text("Disclaimer", 60, diff);

      doc.moveDown(0.5);

      doc
        .fill("#000000")
        .opacity(0.5)
        .fontSize(8)
        .lineWidth(5)
        .list(termsAndConditions);

      doc.image(`${__dirname}/${signatureImage}`, 500, diff, {
        fit: [maxWidth, maxHeight],
        align: "center",
      });

      doc.moveDown(0.5);

      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(14)
        .opacity(1)
        .fill("#000000")
        .text(doctorName, {
          align: "right",
        });
      doc
        .font(`${__dirname}/Poppins-Regular.ttf`)
        .fontSize(14)
        .fill("#000000")
        .text(medicalDegree, {
          align: "right",
        });

      doc.end();

      stream.on("close", async () => {
        //generate images from pdf
        pdf2img.setOptions({
          type: "jpg",
          size: 1024,
          density: 600,
          outputdir: `${appRoot.path}/public/prescriptions/images`,
          outputname: fileName.replace(".pdf", ""),
          page: null,
          quality: 100,
        });

        pdf2img.convert(PDFPath, function (err, response) {
          if (err) {
            reject(err);
          } else {
            return resolve({
              PDFFileName: fileName,
              images: response.message,
            });
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generatePrescriptionPDFAndImages;
