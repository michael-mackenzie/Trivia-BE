const { google } = require('googleapis');
const sheets = google.sheets('v4');
require('dotenv').config()

const rangeToGather = 'A2:G101'

const params = {
    auth: process.env["GOOGLE_API_KEY"],
    spreadsheetId: process.env["GOOGLE_SHEET_ID"],
    range: rangeToGather
}

sheets.spreadsheets.values.get(params).then(({data}) => {
    const parsedValues = data.values.map(question => (
        {
            questionText: question[0],
            answers: question.slice(1,5),
            correctAnswerNumber: question[5],
            learnMoreLink: question[6]
        }
    ))

    console.log(parsedValues)
})

