const { default: mongoose } = require("mongoose");
const userModel = require("../models/userModel");

let userCtrl = {};
userCtrl.getAllUsers = (req, res, next) => {
  try {
    userModel.find({}).then(
      (users) => {
        return res.status(200).json({
          status: "success",
          users,
        });
      },
      (error) => {
        return res
          .status(400)
          .json({ status: "failed", message: error.message });
      }
    );
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

userCtrl.getUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let doc = await userModel.findOne({ id });
    if (doc) {
      return res.status(200).json({
        status: "success",
        user: doc,
      });
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "No such user" });
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};
userCtrl.create = async (req, res, next) => {
  try {
    let { username, email } = JSON.parse(JSON.stringify(req.body));
    let doc = await userModel.find({ $or: [{ username, email }] });
    if (doc && doc.length > 0) {
      return res.status(400).json({
        status: "success",
        message: "Email or username is already exist",
      });
    } else {
      let prevDoc = await userModel.findOne({}).sort({ _id: -1 });

      let user = { id: prevDoc ? prevDoc.id + 1 : 1, username, email };
      //console.log(user);
      userModel.create(user).then(
        (doc) => {
          return res.status(200).json({
            status: "success",
            message: "user created successfully",
            user,
          });
        },
        (error) => {
          return res
            .status(400)
            .json({ status: "failed", message: error.message });
        }
      );
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};
userCtrl.update = async (req, res, next) => {
  try {
    let id = req.params.id;
    let { username, email } = JSON.parse(JSON.stringify(req.body));
    let doc = await userModel.findOne({ id });
    if (doc) {
      let newDoc = { updatedAt: new Date() };
      username
        ? (newDoc["username"] = username)
        : (newDoc["username"] = doc.username);
      email ? (newDoc["email"] = email) : (newDoc["email"] = doc.email);

      userModel.updateOne({ id }, { $set: newDoc }).then(
        (doc) => {
          return res.status(200).json({
            status: "success",
            message: "user updated successfully",
          });
        },
        (error) => {
          return res
            .status(400)
            .json({ status: "failed", message: error.message });
        }
      );
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "No such user" });
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};
userCtrl.delete = async (req, res, next) => {
  try {
    let id = req.params.id;
    let doc = await userModel.findOne({ id });
    if (doc) {
      userModel.deleteOne({ id }).then(
        (doc) => {
          return res.status(200).json({
            status: "success",
            message: "user deleted successfully",
          });
        },
        (error) => {
          return res
            .status(400)
            .json({ status: "failed", message: error.message });
        }
      );
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "No such user" });
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

module.exports = userCtrl;
