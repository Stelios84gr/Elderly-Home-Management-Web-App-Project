const express = require('express')
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, staffController.findAll);router.get('/checkDuplicateUsername/:username', staffController.checkDuplicateUsername);
router.get('/checkDuplicateEmail/:email', staffController.checkDuplicateEmail);
router.get('/:username', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), staffController.findOne);
router.post('/', verifyToken, verifyRoles("ADMIN"), staffController.create);
router.patch('/:username', verifyToken, verifyRoles("ADMIN"),  staffController.update);
router.delete('/:username', verifyToken, verifyRoles("ADMIN"), staffController.deleteByUsername);

module.exports = router;