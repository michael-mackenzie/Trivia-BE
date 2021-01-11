const { google } = require('googleapis');
const sheets = google.sheets('v4');
require('dotenv').config()

const params = {
    auth: process.env["GOOGLE_API_KEY"], // specify your API key here
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: process.env["GOOGLE_SHEET_ID"],
    range: 'A1:H100'
}

sheets.spreadsheets.values.get(params).then(({data}) => {
    console.log(data.values)
})