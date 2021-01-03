const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('로그인 창 보여줌');
})
router.post('/', (req, res, next) => {
    console.log('로그인 실행');
})

module.exports = router;
