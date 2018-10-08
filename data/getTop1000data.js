const fs = require('fs')

let path1 = "./download/doodle";
let path2 = ".ndjson";
let path3 = "./top1000/"
let path4 = ".ndjson";
let number = 100;
function get_line(fileNum, line_no, callback) {
    filename = path1 + fileNum.toString() + path2;

    var stream = fs.createReadStream(filename, {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
//        mode: 0666,
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


function saveFile(i, lines) {
    let fileNameToWrite = path3 + i.toString() + path4;
    console.log(fileNameToWrite);
    let doodles = {};
    //doodles[JSON.parse(lines[1000]).word] = lines;
    doodles[JSON.parse(lines[1000]).word] = [];
    for (let k = 0; k < 1000; k++) {
        doodles[JSON.parse(lines[1000]).word].push(JSON.parse(lines[k]));
    }
    fs.writeFile(fileNameToWrite, JSON.stringify(doodles), () => {
        //if (err) throw err;
        console.log('The file has been saved!');
    });
}

function saveStringToFile(i, lines) {
    let fileNameToWrite = path3 + i.toString() + path4;
    console.log(fileNameToWrite);
    let doodles = "";
    //doodles[JSON.parse(lines[1000]).word] = lines;
    for (let k = 0; k < number; k++) {
        doodles += lines[k];
        doodles += "\n";
    }
    fs.writeFile(fileNameToWrite, doodles, () => {
        //if (err) throw err;
        console.log('The file has been saved!');
    });
}
for (let fileNum = 1; fileNum <= 345; fileNum++) {
    let i = fileNum;
    get_line(i, number, (error, lines) => {
        saveStringToFile(i, lines);
    });
}
