var express = require("express");
var router = express.Router();

const orderCtrl = require("../controllers/orderController");

// /* GET users listing. */
router.get("/user/:userId", orderCtrl.getAllOrdersByUserId);
router.get("/getAllOrdersByUser", orderCtrl.getAllOrdersByUser);
router.get("/revenue/", orderCtrl.getTotalRevenue);

router.get("/:id", orderCtrl.getOrderById);

router.post("/", orderCtrl.create);
router.put("/:id", orderCtrl.updateAmount);
router.delete("/:id", orderCtrl.delete);

module.exports = router;
