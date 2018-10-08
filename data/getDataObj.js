'use strict'
const fs = require('fs')
let number =10;

let path3 = "data/top1000/"
let path4 = ".ndjson";

let path1 = "data/simplified/doodle";
let path2 = ".ndjson";

var path = require('path');
global.appRoot = path.resolve(__dirname);



var data = {};

function get_line(fileNum, line_no, callback) {
    let filename = path3 + fileNum.toString() + path4;

    //let filename = path1 + fileNum.toString() + path2;
    var stream = fs.createReadStream(filename, {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
        //mode: 0666,
        bufferSize: 64 * 1024
    });

    var fileData = '';
    stream.on('data', function(data) {
        fileData += data;

        // The next lines should be improved
        var lines = fileData.split("\n");

        if (lines.length >= line_no) {
            stream.destroy();
            callback(null, lines);
        }
    });

    stream.on('error', function() {
        callback('Error', null);
    });

    stream.on('end', function() {
        callback('File end reached without finding line', null);
    });

}


function storeData(lines) {
    let word = JSON.parse(lines[1]).word;
    data[word] = [];
    for (let i = 0; i < number; i++) {
        data[word].push(JSON.parse(lines[i]));
    }
}

for (let fileNum = 1; fileNum <= 345; fileNum++) {
    let i = fileNum;
    get_line(i, number, (error, lines) => {
        storeData(lines);
    });
}

export default data;

//setTimeout(function() {
//		for( let  prop in data)  {
//				console.log(data[prop].length);
//		}
//}, 3000);
