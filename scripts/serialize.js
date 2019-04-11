'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const SAMPLES = fs.readdirSync(path.resolve(__dirname, '../samples'));
const FORMATS = fs.readdirSync(path.resolve(__dirname, '../formats'));

const htmlTemplate = ({ name, serializedContent }) => `
<!DOCTYPE html>
<html>
<head>
    <title>${name}</title>
</head>
<body>
    <div id="container">${serializedContent}</div>

    <script src="/shared/assert.js"></script>
    <script src="../test.js"></script>
</body>
</html>
`;

async function run() {
    const browser = await puppeteer.launch();

    for (const sampleName of SAMPLES) {
        for (const format of FORMATS) {
            const page = await browser.newPage();
        
            page.on('pageerror', (err) => {
                console.error(`Error for ${sampleName}`, err);
                process.exit(1);
            });
            
            await page.goto(`http://localhost:8080/samples/${sampleName}/index.html`);
            await page.addScriptTag({
                url: `/formats/${format}/serialize.js`,
            });
        
            let serializedContent = await page.evaluate(() => {
                return serialize(container);
            });

            const rehydrationScript = fs.readFileSync(
                path.resolve(__dirname, `../formats/${format}/rehydrate.js`),
                'utf-8'
            );

            if (format === 'tree-of-tree-with-script') {
                serializedContent = `<script>${rehydrationScript}</script>` + serializedContent;
            } else {
                serializedContent += `<script>${rehydrationScript}</script>`;
            }
        
            const rendered = htmlTemplate({
                name: sampleName,
                serializedContent,
                rehydrationScript
            });

            fs.writeFileSync(
                path.resolve(__dirname, `../samples/${sampleName}/rendered/${format}.html`),
                rendered
            );
    
            await page.close();
        }
    }

    await browser.close();
}

run();