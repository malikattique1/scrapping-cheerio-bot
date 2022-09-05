const { checkToken } = require("../../auth/token_validation");
const router = require("express").Router();
const {
  login,
  createuser,
  getvpns,
  getvpnlinkfromid,
} = require("./vpngate.controller");


router.post("/",createuser);
router.post("/login", login);


// router.get("/",getvpns);
router.get("/",checkToken,getvpns);

// router.post("/:id",getvpnlinkfromid);
router.post("/:id",checkToken,getvpnlinkfromid);


module.exports = router;
