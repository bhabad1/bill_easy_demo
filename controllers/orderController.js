const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");

let orderCtrl = {};
orderCtrl.getAllOrdersByUserId = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let docs = await orderModel.find({ userId });
    if (docs && docs.length > 0) {
      return res.status(200).json({
        status: "success",
        orders: docs,
      });
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "No such order" });
    }
  } catch (error) {}
};

orderCtrl.getOrderById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let doc = await orderModel.findOne({ id });
    if (doc) {
      return res.status(200).json({
        status: "success",
        user: doc,
      });
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "No such order" });
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

orderCtrl.create = async (req, res, next) => {
  try {
    let { userId, totalAmount } = JSON.parse(JSON.stringify(req.body));

    let prevDoc = await orderModel.findOne({}).sort({ _id: -1 });

    let order = { id: prevDoc ? prevDoc.id + 1 : 1, userId, totalAmount };
    orderModel.create(order).then(
      (doc) => {
        return res.status(200).json({
          status: "success",
          message: "order created successfully",
          order,
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

orderCtrl.updateAmount = async (req, res, next) => {
  try {
    let id = req.params.id;
    let { totalAmount } = JSON.parse(JSON.stringify(req.body));
    let doc = await orderModel.findOne({ id });
    if (doc) {
      let newDoc = { updatedAt: new Date() };
      totalAmount
        ? (newDoc["totalAmount"] = totalAmount)
        : (newDoc["totalAmount"] = doc.totalAmount);

      orderModel.updateOne({ id }, { $set: newDoc }).then(
        (doc) => {
          return res.status(200).json({
            status: "success",
            message: "order updated successfully",
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
        .json({ status: "failed", message: "No such order" });
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

orderCtrl.delete = async (req, res, next) => {
  try {
    let id = req.params.id;
    let doc = await orderModel.findOne({ id });
    if (doc) {
      orderModel.deleteOne({ id }).then(
        (doc) => {
          return res.status(200).json({
            status: "success",
            message: "order deleted successfully",
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
        .json({ status: "failed", message: "No such order" });
    }
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

orderCtrl.getAllOrdersByUser = async (req, res, next) => {
  try {
    let pipeline = [
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          orders: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          //   localField: "_id",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$id", "$$userId"] },
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          userId: "$_id",
          totalOrders: 1,
          orders: 1,
        },
      },
    ];

    orderModel.aggregate(pipeline).then(
      (docs) => {
        return res.status(200).json({ status: "success", data: docs });
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

orderCtrl.getTotalRevenue = async (req, res, next) => {
  try {
    let pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: -1,
          totalRevenue: "$total",
          totalOrdes: "$totalOrders",
        },
      },
    ];
    orderModel.aggregate(pipeline).then(
      (docs) => {
        return res.status(200).json({ status: "success", data: docs });
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

module.exports = orderCtrl;
