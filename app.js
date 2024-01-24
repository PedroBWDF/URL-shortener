const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('hola')
})

//設定動態路由
app.get(':/shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  res.send(`Generating short URL for: ${shortUrl}`)
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})