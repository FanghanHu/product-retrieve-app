const express = require("express");
const puppeteer = require("puppeteer");

const PORT = process.env.PORT || 3000;

const app = express();

//start the puppeteer browser
let browser;
puppeteer.launch().then(result => {
    browser = result;
    console.log("Puppeteer browser started.")
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//html retrieving API
app.get('/get', async (req, res) => {
    const url = req.query.url;

    if(url) {
        console.log("retrieving url:", url);
        const page = await browser.newPage();
        await page.goto(url);
        let bodyHTML = await page.evaluate(() =>  document.documentElement.outerHTML);
        page.close();
        res.send(bodyHTML);
    } else {
        res.status(400).send("invaid url");
    }
});

app.use(express.static('public'));

app.listen(PORT, async () => {
    console.log("Server is now listening on port: " + PORT);
});