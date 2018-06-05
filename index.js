///////////////////////////////////
//   引入package和建立Server      //
///////////////////////////////////
const path = require("path");
const express = require("express");
const cors = require("cors");
const server = express();
const Tesseract = require('tesseract.js');

var fs = require('fs');
var formidable = require('formidable');

// html file containing upload form
var upload_html = fs.readFileSync("views\\index.html");

// replace this with the location to save uploaded files
//var upload_path = "C:\\Users\\GAO-ZIE JIE\\Desktop\\jk\\";
var upload_path = __dirname + "\\static\\file\\"
//server.use(cors({credentials: true, origin: true}));
server.use(cors());
server.use('/static', express.static(__dirname + '/static'));
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

server.get('/test', (req, res) => {
    res.sendFile('test.html', {
        root : path.join(__dirname, './views/')
    });
});

server.post('/fileupload', (req, res) => {
    if (req.url == '/uploadform') {
        res.writeHead(200);
        res.write(upload_html);
        return res.end();
    } else if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // oldpath : temporary folder to which file is saved to
            var oldpath = files.filetoupload.path;
            var newpath = upload_path + files.filetoupload.name;
            // copy the file to a new location
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                // you may respond with another html page

                Tesseract.recognize(newpath, {
                    lang: 'eng',
                }).progress(function (message) {
                    //console.log(message);
                }).then(function (result) {
                    //console.log(result);
                    var block = result.blocks[0].bbox;
                    var output = '圖片位置x0: ' + block.x0 + '\n';
                    output += '圖片位置x1: ' + block.x1 + '\n';
                    output += '圖片位置y0: ' + block.y0 + '\n';
                    output += '圖片位置y1: ' + block.y1 + '\n';
                    output += 'text: ' + result.text + '\n';
                    console.log(output);

					
					var fss = require('fs');
					fss.writeFile("output.txt", output, function(err) {
						if(err) {
							console.log(err);
						} else {
							console.log("The file was saved!");
						}
					});
					

                }).catch(function (error) {
                    console.error(error);
                });

                res.write('File uploaded and moved!');
                //res.write(oldpath);
                res.write(newpath);
                res.end();
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`[+] Start server on ${PORT}`);
});
