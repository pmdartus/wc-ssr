const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

puppeteer.launch({ 
    headless: false, 
    devtools: true,
    slowMo: 250
}).then(async browser => {
    const page = await browser.newPage();
    await page.goto('http://localhost:8000/pages/nested/index.html');
    await page.addScriptTag({
        content: fs.readFileSync(path.resolve(__dirname, '../formats/flat-tree/serialize.js')),
    });
    await page.evaluate(() => {debugger;});
    const res = await page.evaluate(() => {
        return serialize(document.body.firstElementChild)
    });

    console.log(res);
  
    await browser.close();
});