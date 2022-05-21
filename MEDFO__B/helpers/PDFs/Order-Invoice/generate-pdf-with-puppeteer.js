const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const appRoot = require("app-root-path");
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const uniqid = require("uniqid");

const compileTemplate = async (templateName, data) => {
    const template = await fs.readFile(path.join(__dirname, `/templates/${templateName}.hbs`), 'utf8');
    const compiledTemplate = hbs.compile(template)(data);
    return compiledTemplate;
};

// the helper to convert my image to base64
hbs.registerHelper("getIntro", async (context, idx) => {
    let bitmap = await fs.readFile(
        path.join(__dirname, "/templates/assets/images", `${context}.png`),
    );
    const buff = await Buffer(bitmap).toString("base64");

    let imgSrcString = `data:image/png;base64,${buff}`;
    return imgSrcString;
});

// hbs.registerHelper('each', function(n, block) {
//     var accum = '';
//     for(var i = 0; i < n; ++i)
//         accum += block.fn(i);
//     return accum;
// });

async function generatePdf(data) {
    return new Promise(async (resolve, reject) => {
        try {
            //check if folders exist if not create
            const publicFolder = existsSync(`${appRoot.path}/public`);
            if (!publicFolder) mkdirSync(`${appRoot.path}/public`);

            const invoiceFolder = existsSync(
                `${appRoot.path}/public/order-invoices`
            );
            if (!invoiceFolder)
                mkdirSync(`${appRoot.path}/public/order-invoices`);

            const pdfFolder = existsSync(`${appRoot.path}/public/order-invoices/pdf`);
            if (!pdfFolder) mkdirSync(`${appRoot.path}/public/order-invoices/pdf`);


            let _id = data._id + ""
            let splittedOrderId = _id.substr(_id.length - 12);
            const fileName = `Order-Invoice_${splittedOrderId}.pdf`;

            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium-browser',
                args: ["--no-sandbox"]
            });
            const page = await browser.newPage();

            console.log('incom', data)

            const content = await compileTemplate('order-invoice', data);

            await page.setContent(content);
            // await page.addStyleTag({ path: `${__dirname}/templates/assets/css/order-invoice.css` });

            await page.emulateMediaType('screen');
            await page.pdf({
                path: `${appRoot.path}/public/order-invoices/pdf/${fileName}`,
                format: 'A4',
                printBackground: true
            });

            console.log('PDF created');
            await browser.close();

            return resolve({
                success: true,
                PDFFileName: fileName
            });

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

module.exports = {
    generatePdf
}