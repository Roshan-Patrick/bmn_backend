const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const nursingController = require('../controllers/nursingRegistration.controller');

// Endpoint for user registration (with file upload)
/**
 * @swagger
 * /api/register/registerNurse:
 *   post:
 *     summary: Register a nurse with an image file
 *     tags:
 *       - Nurse Registration
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               aadhaar:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               education:
 *                 type: string
 *               experience:
 *                 type: string
 *               languages:
 *                 type: string
 *               specialization:
 *                 type: string
 *               address:
 *                 type: string
 *               base_location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nurse registered successfully
 *       400:
 *         description: Invalid input or file missing
 *       500:
 *         description: Server error
 */
router.post('/registerNurse', upload.single('photo'), nursingController.registerNurse);

/**
 * @swagger
 * /api/register/registrations:
 *   get:
 *     summary: Get all nurse registrations
 *     tags:
 *       - Nurse Registration
 *     responses:
 *       200:
 *         description: List of nurse registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   mobile:
 *                     type: string
 *                   email:
 *                     type: string
 *                   file_path:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/registrations', nursingController.fetchAllRegistrationsNurse);

module.exports = router;