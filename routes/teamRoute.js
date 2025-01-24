const express = require('express');
const { createTeam, inviteMember } = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTeam);
router.post('/invite', authMiddleware, inviteMember);


module.exports = router;