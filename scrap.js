const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800})
    await page.goto('https://openclassrooms.com/fr/login', {waitUntil: 'networkidle2'});

    await page.evaluate(() => {
        document.querySelector("input[name='_username']").value = "Username here";
        document.querySelector("input[name='_password']").value = "Password here";
        document.querySelector("input[name='_target_path']").value = 'https://openclassrooms.com/fr/login';
        document.querySelector("#login").click();
    });

    const page2 = await browser.newPage();
    await page2.goto('https://openclassrooms.com/fr/dashboard', {waitUntil: 'networkidle2'});
    var html = await page2.content();

    await fs.writeFile('data.txt', '', (err) => {
        if (err) throw err;
        else {
            var $ = cheerio.load(html);
            var allitems = $("#list-course-followed tbody").children();
            var nom;
            var percent;
            allitems.each((index) => {
                nom = $('#list-course-followed tbody').children().eq(index).children().eq(0).find("a.dashboardTable__link").text();
                nom = nom.substring(1, nom.length - 1);
                percent = $('#list-course-followed tbody').children().eq(index).children().eq(2).find("div.progressbar__rate").text();
                percent = percent.substring(1, percent.length - 1).replace(/ /g, "");
                fs.appendFile('data.txt', nom + ';' + percent + '\n', (err) => {
                    if (err) throw err;
                });
            });
        }
    });

    await browser.close();
})();

