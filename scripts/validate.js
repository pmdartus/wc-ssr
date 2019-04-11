'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const SAMPLES = fs.readdirSync(path.resolve(__dirname, '../samples'));
const FORMATS = fs.readdirSync(path.resolve(__dirname, '../formats'));

async function run() {
    const browser = await puppeteer.launch();

    for (const sampleName of SAMPLES) {
        for (const format of FORMATS) {
            const page = await browser.newPage();
        
            page.on('pageerror', (err) => {
                console.error(`${sampleName} - ${format}:`, err);
            });
            
            await page.goto(`http://localhost:8080/samples/${sampleName}/rendered/${format}.html`);
            await page.close();
        }
    }

    await browser.close();
}

run();