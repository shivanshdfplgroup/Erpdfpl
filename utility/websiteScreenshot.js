const puppeteer = require('puppeteer')

const makeAutomate = async (req, res) => {

    try {
 
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] }); // Set headless: true or headless: false as desired
      const page = await browser.newPage();
      await page.goto('https://www.google.com');
  await page.goto('http://localhost:5173',{waitUntil:'networkidle0'});
  console.log('here')
    // Navigate to a new page
    await page.goto('https://google.com',{waitUntil:'networkidle0'});
  
   } catch (error) {
    console.error('An error occurred:', error);
      return res.status(500).json({error:'An error occurred during browser automation.'});
    }
  }




  const makeAutomatePan = async (req, res) => {
    try {
  //    const browser = await puppeteer.launch({ headless: false });
      // const browser = await puppeteer.connect();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  
      const page = await browser.newPage();
  
      await page.goto(`https://razorpay.com/gst-number-search/pan/${req.body.panNumber}/`);
  
      await browser.disconnect();
      // Find the input field by ID and type the GST TIN
      return res.status(200).json({msg:'Browser opened successfully.'});
  
    } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({error:'An error occurred during browser automation.'});
    }
  }

const makeScreeShot = async (req, res) => {
    // console.log(req.body.gstNumber)
  
    try {
    const browser = await puppeteer.launch();
      // Create a new page
      const page = await browser.newPage();
      // Navigate to the desired webpage
      await page.setViewport({
        width: 700,
        height: 530,
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
      });
      await page.goto(`https://razorpay.com/gst-number-search/${req.body.gstNumber}/`, { waitUntil: 'networkidle0' });
      browser.on('disconnected', () => {
        console.log('Browser session ended unexpectedly.');
      });
      // Select the div element you want to capture
      const divSelector = 'section#verification-tool'; // Replace with the appropriate selector for the div element
  
      // Wait for the div element to be visible on the page
      try{
        await page.waitForSelector(divSelector, { waitUntil: 'networkidle0' });
      }
      catch(error){
        return res.status(500).json({error:'An error occurred during browser automation.'});
  
      }
  
  
      // Get a handle to the div element
      // const divElement = await page.$(divSelector);
  
      // Capture a screenshot of the div element
      const screenshot = await page.screenshot({
          encoding: 'binary',
          clip: {
            x: 0,
            y: 500,
            width: 500,
            height: 500,
          },
        });
  
      const dataUrl = `data:image/png;base64,${screenshot.toString('base64')}`;
      await browser.close();
  
      //console.log(screenshot);
        return  res.status(200).json({data:dataUrl});
  
    } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({error:'An error occurred during browser automation.'});
    }
  }



  const makeScreeShotPan = async (req, res) => {
    // console.log(req.body.panNumber)
  
    try {
    const browser = await puppeteer.launch();
      // Create a new page
      const page = await browser.newPage();
      // Navigate to the desired webpage
      await page.setViewport({
        width: 800,
        height: 530,
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
      });
      await page.goto(`https://razorpay.com/gst-number-search/pan/${req.body.panNumber}/`, { waitUntil: 'networkidle0' });
      browser.on('disconnected', () => {
        console.log('Browser session ended unexpectedly.');
      });
      // Select the div element you want to capture
      const divSelector = 'div#gst-numbers-table'; // Replace with the appropriate selector for the div element
      const headSelector = 'div#chakra-skip-nav'; // Replace with the appropriate selector for the div element
  
      // Wait for the div element to be visible on the page
      try{ await page.waitForSelector(divSelector, { waitUntil: 'networkidle0' });    }
      catch(error){
        //When PAN has no GST attached
        await page.waitForSelector(headSelector, { waitUntil: 'networkidle0' });
        const screenshot = await page.screenshot({
          encoding: 'binary',
          clip: {
            x: 0,
            y: 50,
            width: 800,
            height: 500,
          },
        });
      const dataUrl = `data:image/png;base64,${screenshot.toString('base64')}`;
      await browser.close();
      return res.status(200).json({data:dataUrl});
      //console.log(screenshot);
      }
  
      const screenshot = await page.screenshot({
          encoding: 'binary',
          clip: {
            x: 0,
            y: 1000,
            width: 800,
            height: 500,
          },
        });
  
      const dataUrl = `data:image/png;base64,${screenshot.toString('base64')}`;
      await browser.close();
      return res.status(200).json({data:dataUrl});
    } catch (error) {
      console.error('An error occurred:', error);
        return res.status(500).json({error:'An error occurred during browser automation.'});
  
  
    }
  }


  module.exports={makeAutomate,makeAutomatePan,makeScreeShot,makeScreeShotPan}