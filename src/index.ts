import puppeteer, {Browser, Page} from 'puppeteer';

const getQuotes = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser: Browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page: Page = await browser.newPage();

    // On this new page:
    // - open the "http://quotes.toscrape.com/" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto("https://quotes.toscrape.com/", {
        waitUntil: "domcontentloaded",
    });

    const tournaments = await page.evaluate(() => {

    });

};

// Start the scraping
getQuotes();