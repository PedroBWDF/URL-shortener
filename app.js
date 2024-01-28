const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const path = require('path')
const fs = require("fs")
const dataFilePath = './public/jsons/data.json'

//把.hbs設定為express樣板引擎
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //用來解析POST請求中表單提交的資料並轉換成Js物件，儲存在req.body
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
// app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index')
})

//使用者提交表單之後的POST路由處理
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.originalUrl //取得user輸入的URL
  const shortCode = generateShortCode()
  const existingShortUrl = getShortUrlByOriginalUrl(originalUrl) //檢查輸入URL是否已經有對應的URL

  console.log(`Existing short URL found: ${existingShortUrl}`);

  if (existingShortUrl) {
    res.render('short', { shortUrl: existingShortUrl })
    return
  } //若提交的url已經存在，直接在short.hbs渲染該URL

  // 寫入資料檔案
  saveToDataFile({ shortCode, originalUrl });

  // 縮短後的網址
  const shortUrl = generateShortCode();

  // Render the short URL
  res.render('short', { shortUrl:`http://localhost:${port}/${shortCode}` })
})

//使用者存取縮短網址的路由處理
app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  const originalUrl = getOriginalUrl(shortCode);

  if (originalUrl) {
    res.redirect(originalUrl);
    console.log(`Redirecting to: ${originalUrl}`);
  } else {
    // res.redirect('/');
    console.log(`Can't find ${originalUrl}`)
    res.status(404).send('短網址未找到')
  }
});

//產生五碼英數亂碼
function generateShortCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 5; i++) {
    shortCode += characters[Math.floor(Math.random() * characters.length)]
  }
  return shortCode
}

function saveToDataFile(data) {
  let dataList = []

  try {
    const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');
    dataList = JSON.parse(dataFileContent);
  } catch (error) {
    // 如果檔案不存在或解析失敗，視為空列表
  }

  dataList.push(data) //新增值到陣列

  fs.writeFileSync(dataFilePath, JSON.stringify(dataList, null, 2), 'utf8');
}

function getOriginalUrl(shortCode) {
  try {
    const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');
    const dataList = JSON.parse(dataFileContent);

    // console.log(dataList)

    const matchingData = dataList.find((data) => data.shortCode === shortCode);
    console.log(matchingData)
    return matchingData ? matchingData.originalUrl : null;
  } catch (error) {
    // 如果檔案不存在或解析失敗，回傳 null
    return null;
  }
}

function getShortUrlByOriginalUrl(originalUrl) {
  try {
    const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');

    const dataList = JSON.parse(dataFileContent);

    const matchingData = dataList.find((data) => data.originalUrl === originalUrl);
    return matchingData ? matchingData.shortCode : null
  } catch (error) {
    // 如果檔案不存在或解析失敗，回傳 null
    return null;
  }
}

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});