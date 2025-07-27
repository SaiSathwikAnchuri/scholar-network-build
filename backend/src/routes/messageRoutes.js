const router = require("express").Router();
const ctrl = require("../controllers/messageController");
const auth = require("../middlewares/auth");

router.get('/', auth, ctrl.inbox);
router.get('/:id', auth, ctrl.thread);
router.post('/', auth, ctrl.send);

module.exports = router;
