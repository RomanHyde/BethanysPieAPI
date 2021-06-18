let fs = require('fs')

const FILE_NAME = './assets/pies.json';

let pieRepo = {
    get: (resolve, reject) => {
        fs.readFile(FILE_NAME, (err, data) => {
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
    }, 
    // add search method for search functionality
    search: (searchObject, resolve, reject) => {
        fs.readFile(FILE_NAME, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                let pies = JSON.parse(data);
                // Perform search
                if (searchObject) {
                    // Example search object 
                    // let searchObject= {
                    //     "id" : 1,
                    //     "name" : "A"
                    // };
                    pies = pies.filter(
                    // if id and / or name match set true
                    p => (searchObject.id ? p.id == searchObject.id: true) &&
                    (searchObject.name ? p.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >= 0 : true));
              }
            resolve(pies);
                 }
            });
        }
    };

module.exports = pieRepo;