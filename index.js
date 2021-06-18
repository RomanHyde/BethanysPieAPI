// Bring in the express server and create application
// The require() function resolves libraries and modules in the Node search path (ususally \node_modules)
let express = require('express');
let app = express();

// Use the express Router object
let router = express.Router();

// Create GET to return a list of all pies
// request, response and then next for middleware handiling
router.get('/', (req, res, next) => {
    res.send("Cherry Pie");
});

// Configure router so all the routes are prefixed with /api/v1 e.g http:localhost:5000/api/
app.use('/api', router);

// Create server to listen on port 5000
const server = app.listen(5000, () => {
    console.log('Node server is running on http:localhost:5000..')
});