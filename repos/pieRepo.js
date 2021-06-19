let fs = require('fs')

const FILE_NAME = './assets/pies2.json';

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
        },
        // Pass in newData
        insert: (newData, resolve, reject) => {
            // read json file
            fs.readFile(FILE_NAME, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    // Parse the JSON file data, push newData to JSON file
                    let pies = JSON.parse(data);
                    pies.push(newData);
                    // convert data via JSON stringify method
                    fs.writeFile(FILE_NAME, JSON.stringify(pies), (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(newData);
                        }
                    });
                }
            });
        },
        // update function
        update: (newData, id, resolve, reject) => {
            // read file
            fs.readFile(FILE_NAME, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    // parse JSON data
                    let pies = JSON.parse(data);
                    // id check
                    let pie = pies.find( p=> p.id == id);
                    if (pie) {
                        // data from old pie data and new data
                        Object.assign(pie, newData);
                        // overwrite file
                        fs.writeFile(FILE_NAME, JSON.stringify(pies), (err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(newData);
                            }
                        });
                    }
                }
            });
        },

        delete: (id, resolve, reject) => {
            fs.readFile(FILE_NAME, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    // pies array
                    let pies = JSON.parse(data);
                    // id check
                    let index = pies.findIndex(p => p.id == id);
                    if (index != -1) {
                        // splice at the index and remove one item
                        pies.splice(index, 1);
                        fs.writeFile(FILE_NAME, JSON.stringify(pies),(err) => {
                            if (err) {
                                reject(err);
                            }
                            else { 
                                resolve(index);
                            }
                        });
                    }
                }
            });
        }

    };

module.exports = pieRepo;