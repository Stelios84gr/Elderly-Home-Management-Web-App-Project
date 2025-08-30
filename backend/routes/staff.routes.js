const express = require('express')
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, staffController.findAll);
// checkDuplicate GET routes first to avoid "route shadowing" (specific ones first, more generic ones after)
router.get('/checkDuplicateUsername/:username', verifyToken, verifyRoles(["ADMIN"]),staffController.checkDuplicateUsername);
router.get('/checkDuplicateEmail/:email', verifyToken, verifyRoles(["ADMIN"]),staffController.checkDuplicateEmail);
router.get('/:username', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), staffController.findOne);
router.post('/', verifyToken, verifyRoles("ADMIN"), staffController.create);
router.patch('/:username', verifyToken, verifyRoles("ADMIN"),  staffController.update);
router.delete('/:username', verifyToken, verifyRoles("ADMIN"), staffController.deleteByUsername);

module.exports = router;