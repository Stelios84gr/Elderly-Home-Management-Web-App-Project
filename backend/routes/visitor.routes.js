const express = require('express')
const router = express.Router();

const visitorController = require('../controllers/visitor.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, visitorController.findAll);
router.get('/:id', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), visitorController.findOne);
router.post('/', verifyToken, verifyRoles("ADMIN"), visitorController.create);
router.patch('/:id', verifyToken, verifyRoles("ADMIN"),  visitorController.update);
router.delete('/:id', verifyToken, verifyRoles("ADMIN"), visitorController.deleteById);

module.exports = router;