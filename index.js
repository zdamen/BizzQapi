const express = require('express');
const ejs = require('ejs');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up the middleware to handle JSON data in the body of the request
app.use(express.json());

// Set up a POST route to handle the "CreateCard" request
app.post('/CreateCard', async (req, res) => {
  try {
    // Extract the data from the request body
    const { links, files, images } = req.body;
  
    // Render the HTML template with the data
    const html = await ejs.renderFile('template.ejs', { links, files,images });

    // Generate a QR code that links to the path of the HTML file
    const fileName = `${Date.now()}.html`;
    const filePath = path.join(__dirname, fileName);
    const urlPath = `http://localhost:${port}/${fileName}`;

    const qrCodeDataUrl = await qrcode.toDataURL(urlPath);

    // Write the HTML file to disk
    fs.writeFileSync(filePath, html);

    // Send the data URI of the generated QR code in the response
    res.json({ qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
