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

 // Add addresses to the PDF
 data.forEach((row) => {
   doc.text(`${row.Name}\n`);
   doc.text(`${row["Shipping Street"]}\n`);
   doc.text(`${row["Shipping City"]}, ${row["Shipping Zip"]}\n`);
   doc.text(`${row["Shipping Province"]}, ${row["Shipping Country"]}\n`);
   doc.addPage();
 });

 // End the PDF and send it to the client
 doc.end();
 return {
   statusCode: 200,
   headers: {
     'Content-Type': 'application/pdf',
   },
   body: doc,
 };
}
