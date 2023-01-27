import { Handler } from '@netlify/functions'
import pdfkit from 'pdfkit';

export const handler: Handler = async (event, context) => {
 // Get data from the request body
 if (!event.body) {
 return {
    statusCode: 400,
  };
 }
 const data = JSON.parse(event.body);

 // Create a PDF document
 const doc = new pdfkit();
 doc.pipe(data);


 // define the number of addresses per row
 const addressesPerRow = 3;
 const colSize = 300;
 const rowSize = 200;

 // set the font size and font family
 doc.fontSize(12).font('Helvetica');

 // loop through the addresses and add them to the PDF
 for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const address = `${row.Name}\n
    ${row["Shipping Street"]}\n
    ${row["Shipping City"]}, ${row["Shipping Zip"]}\n
    ${row["Shipping Province"]}, ${row["Shipping Country"]}\n
    `
   // calculate the x and y coordinates for the current address
   const x = (i % addressesPerRow) * colSize;
   const y = Math.floor(i / addressesPerRow) * rowSize;

   // add the address to the PDF at the specified coordinates
   doc.text(address, x, y);
 }


 // End the PDF and send it to the client
 doc.end();
 return {
   statusCode: 200,
   headers: {
     'Content-Type': 'application/pdf',
   },
   body: JSON.stringify(doc),
 };
}
