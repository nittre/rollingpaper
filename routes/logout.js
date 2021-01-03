const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
    console.log('로그아웃 실행');
})

module.exports = router;
