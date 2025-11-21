const express =  require('express')
const router = express.Router()
const { body } = require('express-validator')
const captainController = require('../controllers/captain.controller')

router.post('/register', [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName').isLength({ min: 3 }).withMessage("First name must be atleast 3 characters long"),
    body('password').isLength({ min: 6}).withMessage("Password must be atleast 6 characters long"),
    body('vehicle.color').notEmpty().withMessage("Vehicle color muct be required"),
    body('vehicle.plate').isLength({ min: 4 }).withMessage("Plate number must be 4 characters long"),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage("Capacity must be atleast 1"),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage("Invalid vehicle type")
], captainController.registerCaptain)

module.exports = router