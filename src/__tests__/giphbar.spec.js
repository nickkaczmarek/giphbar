import puppeteer from "puppeteer";

let browser, page, navigationPromise;

describe("tests", () => {
  beforeAll(async function () {
    browser = await puppeteer.launch({ headless: false, devtools: true });
    page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    navigationPromise = page.waitForNavigation();
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/");
  });

  it("should search", async () => {
    await page.waitForSelector("#search");
    await page.type("#search", "test");
    await page.keyboard.press("Enter");
    await page.waitForSelector(".gif-container > img:first-child");
  });

  it("should login", async () => {
    // let navBurger = await page.$("#nav-burger");
    // if (navBurger) {
    //   await navBurger.click();
    // }
    await page.waitForSelector("#login");
    await page.click("#login");
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    await page.waitForSelector('input[name="email"]', { visible: true });
    await page.type('input[name="email"]', "e2e@gmail.com");

    await page.waitForSelector('input[name="password"]', { visible: true });
    await page.type('input[name="password"]', "*tv*hYCaDDDYN8hmfqwy");

    await page.waitForSelector(".auth0-lock-submit > .auth0-label-submit");
    await page.click(".auth0-lock-submit > .auth0-label-submit");

    debugger;
    // navBurger = await page.$("#nav-burger");
    // debugger;

    // if (navBurger) {
    //   await navBurger.click();
    // }
    await page.waitForSelector("#profile", { visible: true });
    const profileLink = await page.$("#profile");
    await Promise.all([profileLink.click(), page.waitForNavigation({ waitUntil: "domcontentloaded" })]);

    expect(page.url()).toStrictEqual("http://localhost:3000/profile");
  }, 30000);

  afterAll(async function () {
    await browser.close();
  });
});
