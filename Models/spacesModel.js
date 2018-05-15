const mongoose = require('mongoose');

var SpaceSchema = mongoose.Schema({
    spaceId: String,
    spaceTitle : String,
    authorName: String,
    authorEmail:String,
    authorId: String,
    spaceTags: [String],
    date: String,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      country:String,
      continent: String
    },
    bibliography: [String],
    usefulLinks: [String]
});

SpaceSchema.static({
	list: async function() {
		return await this.find({}, null, {}).lean();
	},
  registerNewSpace: async function(req){
      try {
        let result = {}
        let doc = await this.findOne({spaceId: req.spaceId})
        if (doc !== null) {
          console.log("device already registerd please use update api")
          result = "device already registerd please use update api"
        } else {
          console.log("saving database...")
          result = await req.save()
        }
        return result
      } catch (e) {
        throw e
      }
    },
    getLocationTuples: async function() {
      try {
        let result = await this.list()
        console.log("result saved is: " + JSON.stringify(result))
        let tuples = []
        if(result !== null) {
          for (var i = 0, len = result.length; i < len; i++) {
            tuples.push(result[i])
          }
          return tuples
        }
        return null

      } catch(e) {
        throw e
      }
    }
});

module.exports = SpaceSchema;
