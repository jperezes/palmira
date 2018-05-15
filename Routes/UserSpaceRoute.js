var mongoose = require('mongoose');
let userSchema = require("../Models/userHistoryModel.js");
const mongoUrl = process.env.USER_DATA_DB;
const userCollectionName = process.env.USER_COL_NAME


//To avoid promise warning
mongoose.Promise = global.Promise;

//create mongo connection
const con = mongoose.createConnection(mongoUrl)
const UserModel = con.model(userCollectionName, userSchema);

class UserSpaceRoute {
	constructor() {
  }
  async registerSpace(req) {
      var userModel = new UserModel()
      userModel.userId = req.body.userId
      userModel.spaces = req.body.spaces
    try {
      let result = await UserModel.registerUserSpace(userModel)
      return result
    }catch (e) {
      console.log("something happened " + e)
      throw e
    }
  }
}

module.exports = UserSpaceRoute
