const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        console.log('회원가입 창 띄우기');
    })
    .post((req, res) => {
        console.log('회원가입 진행');
    })

module.exports = router;