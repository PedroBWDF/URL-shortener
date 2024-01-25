const express = require('express')
const app = express()
const port = 3000

const fs = require("fs")
const dataFilePath = 'public/jsons/data.json'
fs.readFile(dataFilePath, function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("Asynchronous read: " + data.toString());
});

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.send('hola')
})

//設定動態路由
app.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  res.send(`Generating short URL for: ${shortURL}`)
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})