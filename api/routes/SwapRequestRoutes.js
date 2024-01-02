// routes/swapRequestRoutes.js

const express = require('express');
const router = express.Router();
 
const swapController = require('../controllers/swapControllers'); //
router.get("/",swapController.getswapAllcourse)
router.post("/add", swapController.addSwapRequest);
router.put("/edit/:id", swapController.editSwapRequest);
router.delete("/delete/:id", swapController.deleteSwapRequest);
router.get('/:email', swapController.getSwapCoursesByUseremail);



module.exports = router;


