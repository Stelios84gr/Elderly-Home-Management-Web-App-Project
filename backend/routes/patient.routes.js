const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, patientController.findAll);
router.get('/:id', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), patientController.findOne);
router.post('/', verifyToken, verifyRoles("ADMIN"), patientController.create);
router.patch('/:id', verifyToken, verifyRoles("ADMIN"),  patientController.update);
router.delete('/:id', verifyToken, verifyRoles("ADMIN"), patientController.deleteById);

module.exports = router;