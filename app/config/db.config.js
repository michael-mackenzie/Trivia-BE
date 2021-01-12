require('dotenv').config()

const username = process.env["DB_USER"];
const password = process.env["DB_PASS"];
const cluster = 'cluster0.fzxxb.mongodb.net';
const database = 'triviagame';

module.exports = {
  url: `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`
};
