const router = require('express').Router();
const ctrl = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const roles = require('../config/roles');

// Authenticated user: get and update own info
router.get('/me', auth, ctrl.me);
router.put('/me', auth, ctrl.update);

// Alumni and students sidebar for chat
router.get('/alumni-sidebar', auth, ctrl.listAlumniSidebar);
router.get('/students-sidebar', auth, ctrl.listStudentsSidebar);

// Public alumni directory (with search/filtering)
router.get('/directory', ctrl.listAlumni);

// Public profile by id (robust validation in controller)
router.get('/profile/:id', ctrl.getProfile);

// ========== ADMIN-ONLY ENDPOINTS (Require JWT and ADMIN role) ==========
router.get('/', auth, roleGuard([roles.ADMIN]), ctrl.listAllUsers);
router.patch('/:id/approve', auth, roleGuard([roles.ADMIN]), ctrl.approveUser);
router.delete('/:id', auth, roleGuard([roles.ADMIN]), ctrl.deleteUser);

module.exports = router;
