const router = require("express").Router();
const ctrl = require("../controllers/eventController");
const auth = require("../middlewares/auth");
const roleGuard = require("../middlewares/roleGuard");
const roles = require("../config/roles");

router.get("/", auth, ctrl.list);

router.post(
  "/",
  auth,
  roleGuard([roles.ALUMNI, roles.ADMIN]),
  ctrl.create
);

router.get("/my/rsvp", auth, ctrl.listMyRsvp);
router.post("/:id/rsvp", auth, ctrl.rsvp);

router.get('/recent', ctrl.mostRecent);

router.patch("/:id/approve", auth, roleGuard([roles.ADMIN]), ctrl.approveEvent);

// ========== MUST BE LAST! ==========
router.get("/:id", auth, ctrl.detail);

module.exports = router;
