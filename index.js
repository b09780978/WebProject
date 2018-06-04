///////////////////////////////////
//   引入package和建立Server      //
///////////////////////////////////
const path = require("path");
const express = require("express");
const cors = require("cors");
const server = express();

///////////////////////////////////
//      設定server folder         //
///////////////////////////////////
server.use(cors());
server.use('/static', express.static(__dirname+'/static'));
server.use(express.static('file'));

///////////////////////////////////
//              常數             //
///////////////////////////////////
const PORT = 8000;

///////////////////////////////////
//          處理路由              //
///////////////////////////////////
server.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './views/')
    });
});


////////////////////////////////////
//     執行server on 8000 port    //
///////////////////////////////////
server.listen(PORT, () => {
    console.log(`[+] Start server on ${PORT}`);
});
