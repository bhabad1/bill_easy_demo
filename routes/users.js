var express = require("express");
var router = express.Router();
const userCtrl = require("../controllers/userController");
/* GET users listing. */
router.get("/", userCtrl.getAllUsers);

router.get("/:id", userCtrl.getUser);

router.post("/", userCtrl.create);

router.put("/:id", userCtrl.update);

router.delete("/:id", userCtrl.delete);

module.exports = router;
