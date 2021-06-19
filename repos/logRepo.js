// Bring in file system
let fs = require('fs');

const FILE_NAME = './logs/log.txt';

let logRepo = {
    // pass in data to write
    write: (data, resolve, reject) => {
        let toWrite = "*".repeat(80) + "\r\n";
        toWrite += `Date/Time: ${new Date().toLocaleDateString()} \r\n`; //diff
        toWrite += `Exception Info: ${JSON.stringify(data)} \r\n`;
        toWrite += "*".repeat(80) + "\r\n";
        // write to log file
        fs.writeFile(FILE_NAME, toWrite, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    }
};

module.exports = logRepo;