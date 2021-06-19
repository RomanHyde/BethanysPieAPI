// bring in logRepo
let logRepo = require('../repos/logRepo');

let errorHelpers = {
    logErrorsToConsole: (err, req, res, next) => {
        // send error ingo to console.error
        console.error(`Log Entry: ${JSON.stringify(errorHelpers.errorBuilder(err))}`) //diff
        console.error("*".repeat(80));
        // forward err to next middleware
        next(err)
    },
    logErrorsToFile: (err, req, res, next) => {
        let errorObject = errorHelpers.errorBuilder(err);
        // add on new property called requestInfo & adding more info to log file
        errorObject.requestInfo = {
            "hostname": req.hostname,
            "path": req.path,
            "app": req.app,
        }
        // pass err object into write
        logRepo.write(errorObject, (data) => {
            console.log(data);
        }, (err) => {
            next(err);
        });
    },
     clientErrorHandler: (err, req, res, next) => {
        // Check request object for error
        if (req.xhr) {
            res.status(500).json({
                "status": 500,
                "statusText": "Internal Server Error",
                "message": "XMLHttpRequest error",
                "error": {
                    "errno": 0,
                    "call": "XMLHttpRequest Call",
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "XMLHttpRequest error"
                }
            });
        } else {
            // forward err to next middleware
            next(err);
        }
    },
    // Last in the chain, no next function contained
    errorHandler: (err, req, res, next) => {
        res.status(500).json(errorHelpers.errorBuilder(err));
    },
    
    // Configure errorBuilder
    // moved from index.js to errorHelpers.js
    errorBuilder: (err) => {
        return {
            "status": 500,
            "statusText": "Internal Server Error",
            "message": err.message,
            "error": {
                "errno": err.errno,
                "call": err.syscall,
                "code": "INTERNAL_SERVER_ERROR",
                "message": err.message
            }
        };
    }
};

module.exports = errorHelpers;