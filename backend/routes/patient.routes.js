const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken;
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', verifyToken, patientController.findAll);
// checkDuplicate GET route first to avoid "route shadowing" (specific ones first, more generic ones after)
router.get('/checkDuplicateUsername/:username', verifyToken, verifyRoles(["ADMIN"]), patientController.checkDuplicateUsername);
router.get('/:username', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), patientController.findOne);
router.post('/', verifyToken, verifyRoles(["ADMIN"]), patientController.create);
router.patch('/:username', verifyToken, verifyRoles(["ADMIN"]),  patientController.update);
router.patch('/addVisitor', verifyToken, verifyRoles(["EDITOR, ADMIN"]), patientController.addVisitorToPatient)
router.patch('/removeVisitor', verifyToken, verifyRoles(["EDITOR", "ADMIN"]), patientController.removeVisitorFromPatient)
router.delete('/:username', verifyToken, verifyRoles(["ADMIN"]), patientController.deleteByUsername);

module.exports = router;