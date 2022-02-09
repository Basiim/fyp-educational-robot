const express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('botMain/mainView',{viewTitle: 'Educational Bot'})
})

module.exports = router;