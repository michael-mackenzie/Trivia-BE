const { google } = require('googleapis');
const sheets = google.sheets('v4');
require('dotenv').config()

const rangeToGather = 'A1:H100'
const params = {
    auth: process.env["GOOGLE_API_KEY"],
    spreadsheetId: process.env["GOOGLE_SHEET_ID"],
    range: rangeToGather
}

sheets.spreadsheets.values.get(params).then(({data}) => {
    console.log(data.values)
})