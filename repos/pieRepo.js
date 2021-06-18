let fs = require('fs')

const FILE_NAME = './assets/pies.json';

let pieRepo = {
    get: (resolve, reject) => {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    },
    // pass in pie ID
    getById: (id, resolve, reject) => {
        fs.readFile(FILE_NAME, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                // parse and place data into JSON object, pass individual pies in and check the id matches
                let pie = JSON.parse(data).find(p => p.id == id);
                resolve(pie);
            }
        });
    }
};

module.exports = pieRepo;