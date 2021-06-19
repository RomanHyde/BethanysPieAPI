// Bring in the express server and create application
// The require() function resolves libraries and modules in the Node search path (ususally \node_modules)
let express = require('express');
let pieRepo = require('./repos/pieRepo')
let errorHelper = require('./helpers/errorHelpers');
let cors = require('cors');
let app = express();

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsin in request object (it only parses JSON)
app.use(express.json());

// Configure CORS 
// cors documentation: https://expressjs.com/en/resources/middleware/cors.html
const corsOptions = {
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 204
  };
  app.use(cors(corsOptions));

// Create GET to return a list of all pies
// request, response and then next for middleware handiling
router.get('/', (req, res, next) => {
    pieRepo.get((data) => {
        // Passing a json object through the .json() method
        res.status(200).json({
            "status" : 200,
            "statusTest": "OK",
            "message": "All pies retrieved!",
            "data": data
        });
    }, (err) => {
        // middleware callback (call next middleware function)
        next(err);
    });
});

// Create GET/searc?id=n&name=str to search for pies by 'id and / or 'name'
// this will look like http://localhost:5000/api/search?id=1&name=a
router.get('/search', (req, res, next) => {
    let searchObject = {
      "id": req.query.id,
      "name": req.query.name
    };

    // pass in searchObject, if we get data back the responce status is 200 and json data is passed in
    pieRepo.search(searchObject, (data) => {
        res.status(200).json({
            "status": 200,
            "statusTest": "OK",
            "message": "All pies retrieved!",
            "data": data
        });
    }, (err) => {
        next(err);
    });
});


// /:id represents the argument that is being passed into the endpoint. The number at the end is the id. e.g http://localhost:5000/api/1
router.get('/:id', (req, res, next) => {
    pieRepo.getById(req.params.id, (data) => {
        if (data) {
            res.status(200).json({
                "status" : 200,
                "statusText" : "OK",
                "message" : "Single pie retrived.",
                "data" : data
            });
        }
        else {
            res.status(404).json({
                // error object
                "status" : 404,
                "statusText" : "Not Found",
                "message" : `The pie ${req.params.id} could not be found.`,
                // error property added
                "error": {
                    "code" : "NOT_FOUND",
                    "message" : `The pie ${req.params.id} could not be found.`
                    }
             });  
            }
        }, (err) => {
            next(err);
        });
    });

// configure router for pie addition
router.post('/', (req, res, next) => {
    pieRepo.insert(req.body, (data) => {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New Pie Added.",
            "data": data
        });
    }, (err) => {
        next(err);
    });
});

// configure put router for updating data
    router.put('/:id', (req, res, next) => {
        pieRepo.getById(req.params.id, (data) => {
          if (data) {
            // Attempt to update the data
            pieRepo.update(req.body, req.params.id, (data) => {
              res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": `The pie ${req.params.id} was updated.`,
                "data": data
              });
            });
          }
          else {
            res.status(404).send({
              "status": 404,
              "statusText": "Not Found",
              "message": `The pie ${req.params.id} could not be found.`,
              "error": {
                "code": "NOT_FOUND",
                "message": `The pie ${req.params.id} could not be found.`
              }
            });
          }
        }, (err) => {
          next(err);
        });
      })
      
// Configure router for deletion, based on which id the user wants to remove
router.delete('/:id', (req, res, next) => {
    pieRepo.getById(req.params.id, (data) => {
        if (data) {
            // Attempt to delete data
            pieRepo.delete(req.params.id, (data) => {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": `The pie ${req.params.id} was deleted`,
                    "data": `Pie ${req.params.id} deleted.`
                  });
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": `The pie ${req.params.id} could not be found.`,
                "error": {
                  "code": "NOT_FOUND",
                  "message": `The pie ${req.params.id} could not be found.`
                }
              });
        }
    }, (err) => {
        next(err);
    });
})

// patch router for testing, edit data partials
router.patch('/:id', (req, res, next) => {
    // find id
    pieRepo.getById(req.params.id, (data) => {
        if (data) {
            // Attempt to update data
            pieRepo.update(req.body, req.params.id, (data) => {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": `Pie ${req.params.id} was patched.`,
                    "data": data
                });
            });
        }
    })
})


// Configure router so all the routes are prefixed with /api/v1 e.g http:localhost:5000/api/
app.use('/api/', router);

// Configure exception logger to console
app.use(errorHelper.logErrorsToConsole);
// Configure exception logger to file
app.use(errorHelper.logErrorsToFile);
// Configure client error handler
app.use(errorHelper.clientErrorHandler);
// Configure catch-all exception middleware last
app.use(errorHelper.errorHandler);

// Create server to listen on port 5000
const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Node server is running on http://localhost:5000..');
    console.log('CORS is enabled')
});