const mongoose = require('mongoose');
let Promise= require('bluebird')

var UserSchema = mongoose.Schema({
    userId: String,
    spaces:[String]
},{ usePushEach: true });


UserSchema.static({
	list: function(callback) {
		this.find({}, null, {}, callback);
	},

  registerUserSpace: async function(req){
      try {
        let result = {}
        let doc = await this.findOne({userId: req.userId})
        if (doc !== null) {
          if (doc.spaces.indexOf(req.spaces) !== -1) {
            console.log("element already present on user space")
            return true
          }
          console.log("updating database...")
          doc.spaces.push(req.spaces)
          result = await doc.save()
        } else {
          console.log("saving database...")
          result = await req.save()
        }
        return result
      } catch (e) {
        throw e
      }
    }
});


module.exports = UserSchema;
