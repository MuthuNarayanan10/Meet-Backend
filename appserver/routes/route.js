const express = require('express');
const router = express.Router();
const RouteController = require('./../controller/routecontroller');

router.get('/getusers',RouteController.getusers);
router.post('/updatemeeting/:id',RouteController.updatemeeting);
router.post('/addnewmeeting',RouteController.addnewmeeting)
router.post('/addnewuser',RouteController.addnewuser)
router.post('/getmeeting',RouteController.getmeeting)
router.post('/getuser',RouteController.getuser)
router.delete('/deletemeeting/:id',RouteController.deletemeeting)
router.get('/getallmeetings',RouteController.getallmeetings);
router.get('/getallusers',RouteController.getallusers)
router.delete('/deleteuser/:id',RouteController.deleteuser)

module.exports = router;
