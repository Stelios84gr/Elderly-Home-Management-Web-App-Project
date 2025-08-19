const express = require('express')
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, staffController.findAll);
router.get('/:id', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), staffController.findOne);
router.post('/', verifyToken, verifyRoles("ADMIN"), staffController.create);
router.patch('/:id', verifyToken, verifyRoles("ADMIN"),  staffController.update);
router.delete('/:id', verifyToken, verifyRoles("ADMIN"), staffController.deleteById);

module.exports = router;