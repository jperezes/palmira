let express = require('express')
let router = express.Router();
let UserSpaceRoute = require('./UserSpaceRoute.js')
let PalmiraSpaceRoute = require('./palmiraSpacesRoute.js')
//const port = 3084
const userSpaceRoute = new UserSpaceRoute()
const palmiraSpaceRoute = new PalmiraSpaceRoute()

const bodyParser = require("body-parser");
let rp = require('request-promise');

// Default options
const defaults = {
  url: "https://api.ciscospark.com",
  headers:{
    'Content-Type': 'application/json; charset=utf-8'
  },
  json: true,
  method:'POST',
	timeout : 5000
};

// Send an API request
const sendRequest = async (data, parentMethod) => {
  console.log("SPARK - API Sending object: " + JSON.stringify(data))
  try {
    const response  = await rp(data);
    return response;
  } catch (e) {
    console.log("[ "+ parentMethod +" ]: " +"Error sending the Request to Spark API: " + JSON.stringify(e))
    throw e
  }
};

/**
 * SparkBotApi register the bot to Cisco Spark Api
 */
class HistoryRoute {
	constructor(port) {
    this.app = express()
    this.initServer(this.app);
    console.log("port in constructor with number " + port)
    this.port = port
	}
  /**
   * Init the express server
   */
  initServer(app){
    let port = this.port
    console.dir("Initializing Palmira web service at port " + port)
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(bodyParser.json());
    app.use('/v1',router);
    router.use(function (req, res, next) {
      next();
    });

    router.route('/myhistory').post(async (req, res) => {
      console.log("received space post " + JSON.stringify(req.body))
      try {
        let result = await userSpaceRoute.registerSpace(req)
        res.send(result)
      } catch(e) {
        res.send("Error processing the post request" + e)
      }

    });

    router.route('/newspace').post(async (req, res) => {
      console.log("received space post " + JSON.stringify(req.body))
      try {
        let result = await palmiraSpaceRoute.registerNewSpace(req)
        res.send(result)
      } catch(e) {
        res.send("Error processing the post request" + e)
      }
    });
    router.route('/checkPosition').post(async (req, res) => {
      console.log("received space post " + JSON.stringify(req.body))
      try {
        let result = await palmiraSpaceRoute.checkPosition(req)
        res.send(result)
      } catch(e) {
        res.send("Error processing the post request" + e)
      }
    });

    app.listen(port, function(port) {
        console.log('\n\nHistory cloud app started at port: ' + port)
    })
    console.log("here I should be")
  }
}

module.exports = HistoryRoute;
