const express = require('express')
const router = express.Router();

const visitorController = require('../controllers/visitor.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, visitorController.findAll);
router.get('/:username', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), visitorController.findOne);
router.post('/', verifyToken, verifyRoles("ADMIN"), visitorController.create);
router.patch('/:username', verifyToken, verifyRoles("ADMIN"),  visitorController.update);
router.delete('/:username', verifyToken, verifyRoles("ADMIN"), visitorController.deleteById);

module.exports = router;