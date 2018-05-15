var mongoose = require('mongoose');
let spaceSchema = require("../Models/spacesModel.js");
const mongoUrl = process.env.SPACE_URL_DB ;
const spCollectionName = process.env.SP_COL_NAME

//create mongo connection
const con = mongoose.createConnection(mongoUrl)
const SpaceModel = con.model(spCollectionName, spaceSchema);

class PalmiraSpaceRoute {
	constructor() {
  }

  //MARK: Database methods
  async registerNewSpace(req) {
      var spaceModel = new SpaceModel()
      spaceModel = this.parseRequest(req.body)
    try {
      let result = await SpaceModel.registerNewSpace(spaceModel)
      return result
    }catch (e) {
      console.log("[palmiraSpacesRoute.registerNewSpace] something happened " + e)
      throw e
    }
  }

  async checkPosition(req) {
      var spaceModel = new SpaceModel()
      var requestedPoint = {
        "point": {
          "latitude" : parseFloat(req.body.point.latitude),
          "longitude" : parseFloat(req.body.point.longitude)
        }
      }
    try {
      let spaces = await SpaceModel.getLocationTuples()
      let result = []
      if(spaces[0].location !== 'undefined') {
        for (var i = 0, len = spaces.length; i < len; i++) {
          let distanceMeters = this.getDistance(spaces[i].location, requestedPoint.point)
          console.log("dinstance to " + spaces[i].spaceTitle + " is : " + distanceMeters)
          if(distanceMeters < 500) {
            result.push(spaces[i])
          }
        }
      }
      return result
    }catch (e) {
      console.log("[palmiraSpacesRoute.checkPosition] something happened " + e)
      throw e
    }
  }

  //MARK: helper methods
  parseRequest(body) {
    var spaceModel = new SpaceModel()
    spaceModel.spaceId = body.spaceId
    spaceModel.spaceTitle = body.spaceTitle
    spaceModel.authorName = body.authorName
    spaceModel.authorEmail = body.authorEmail
    spaceModel.authorId = body.authorId
    spaceModel.spaceTags = body.spaceTags
    spaceModel.date = body.date
    spaceModel.location = body.location
    spaceModel.location.latitude = parseFloat(body.location.latitude)
    spaceModel.location.longitude = parseFloat(body.location.longitude)
    spaceModel.location.city =  body.location.city
    spaceModel.location.continent = body.location.continent
    spaceModel.bibliography = body.bibliography
    spaceModel.usefulLinks = body.usefulLinks

    return spaceModel
  }

  rad(x) {
    return x * Math.PI / 180;
  };

  getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter

    var dLat = this.rad(p2.latitude - p1.latitude);
    var dLong = this.rad(p2.longitude - p1.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };



}

module.exports = PalmiraSpaceRoute
