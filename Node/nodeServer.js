const http = require('http');
var fs = require('fs');
const express = require('express')
const app = express()
var cors = require('cors');
// const port = 5000;
const port = 5000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000/');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

app.use(cors({origin: `http://localhost:${port}/`}));

app.get(`http://localhost:${port}/`, function (req, res) {
  res.send('Hello World!')
})

app.post(`http://localhost:${port}/`, (req, res) => {
  console.log('Exp Req: ', req)

  res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello Express!', req)

    // fs.readFile('data.json',function(err,content){
    //   if(err) throw err;
    //   var parseJson = JSON.parse(content);
    //   for (i=0; i <11 ; i++){
    //    parseJson.table.push({id:i, square:i*i})
    //   }
    //   fs.writeFile('data.json',JSON.stringify(parseJson),function(err){
    //     if(err) throw err;
    //   })
    // })
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })