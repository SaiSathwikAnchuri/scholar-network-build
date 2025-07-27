const router = require('express').Router();
const ctrl = require('../controllers/jobController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const roles = require('../config/roles');

router.get('/', ctrl.list); // Public list
router.post('/', auth, roleGuard([roles.ALUMNI, roles.ADMIN]), ctrl.add);
router.post('/:jobId/apply', auth, roleGuard([roles.ALUMNI, roles.STUDENT]), ctrl.apply);
router.delete('/:jobId', auth, ctrl.remove);

module.exports = router;
