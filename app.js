const {
    Builder,
    By,
    Key,
    until,
    Capabilities
} = require("selenium-webdriver");
require("selenium-webdriver");
require("chromedriver");
let driver = new Builder()
.withCapabilities(Capabilities.chrome())
.build();

const shoes_bags_url =
    "https://xskt.com.vn/ket-qua-xo-so-theo-ngay/mien-trung-xsmt/31-3-2020.html";

const obj1 = {};
const obj2 = {};

driver
    .get(shoes_bags_url)
    .then(() => driver.wait(until.elementsLocated(By.className('box-ketqua')), 1000))
    .then(() => driver.getPageSource())
    .then((source) => {
        const $ = require('cheerio').load(source);
        getProductElements($).map(ele => extractProductInfo(ele));
        console.log(obj1, obj2);
    })
    .then(() => {
        driver.quit();
    });

    const getProductElements = ($) => {
        let productEles = [];
        $('#MT0').find('> tbody > tr').each((_, ele) => {
            productEles.push($(ele));
        });
        return productEles;
    };

    const extractProductInfo = ($) => {
        let city1 = $.find('th:nth-child(2) > ').text();
        let city2 = $.find('th:nth-child(3) > ').text();
        let giai = $.find('td:nth-child(1)').text();
        let giaiso1 = $.find('td:nth-child(2)').toString();
        let kq1 = normalizeText(giaiso1);
        let giaiso2 = $.find('td:nth-child(3)').toString();
        let kq2 = normalizeText(giaiso2);
        if (city1) {
            obj1.city1 = city1;
        }
        if (city2) {
            obj2.city2 = city2;
        }
        if(giai) {
            obj1[giai] = kq1;
            obj2[giai] = kq2;
        }
    };

    const normalizeText = (text) => {
        var newTex =  text.replace(/<td>|<\/td>|<\/b>|<b>/g, '').trim();
        return newTex.replace(/<br>/g, ',').trim();
    };