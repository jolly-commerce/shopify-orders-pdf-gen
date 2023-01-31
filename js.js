// Handle form submission
const form = document.getElementById("upload-form");
function getCountryFromCode(code) {
  return code == "FR" ? "France" : code;
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Parse the CSV file
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const data = await parseCsvFile(file);

  // Handle the server response
  const pdf = await pdfBuild(data);

  const link = document.createElement("a");
  link.href = URL.createObjectURL(pdf);
  link.download = "addresses.pdf";
  link.click();
});

async function pdfBuild(_data) {
  return new Promise(function (resolve, reject) {
    // loop through the addresses and add them to the PDF
    // Create a PDF document
    // define the number of addresses per row
    const addressesPerRow = 2;




    const docDefinition = {
      pageSize: "A4",
      pageMargins: [ 11.2464, 36, 11.2464, 36 ],
      pageOrientation: "portrait",
      content: [
        {
          table: {
            dontBreakRows:true,
            widths: ["50%", "50%"],
            heights: 144,
            body: [
              // Add your table data here
            ],
          },
          layout: {
            fillColor: function (i, node) {
              return null;
            },
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            cellHeight: 96,
          },

          pageOrientation: "portrait",

        },
      ],
    };

    const data = _data.filter(function (d) {
      return d["Shipping Name"];
    });
    var rowCount = 0;
    // loop through the addresses and add them to the PDF
    for (let i = 0; i < data.length; i += addressesPerRow) {
      const row = [];

      for (let j = 0; j < addressesPerRow; j++) {
        if (!data[i + j]) {
          row.push({ text: "" });
          continue;
        }
        const address = `
                  ${data[i + j]["Shipping Name"]}\n
                  ${data[i + j]["Shipping Address1"]} ${
          data[i + j]["Shipping Address2"]
        },\n
        ${data[i + j]["Shipping Zip"]}  ${data[i + j]["Shipping City"]} ${
          data[i + j]["Shipping Province"]
        }
        \n ${getCountryFromCode(data[i + j]["Shipping Country"])}`;
        row.push({ text: address });
      }

      docDefinition.content[0].table.body.push(row);
      rowCount += 1;

      //insert a page break every 5 rows
      if (rowCount % 5 === 0) {
        docDefinition.content.push({ text: "", pageBreak: "before", rowSpan: 2 });
      }
    }

    pdfMake.createPdf(docDefinition).download();
  });
}
// Parse the CSV file
async function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result;
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
      });
    };
    reader.readAsText(file);
  });
}
