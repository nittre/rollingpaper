const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('내 롤링페이퍼 목록 보여줌');
})
router.route('/new')
    .get((req, res) => {
        console.log('새로운 롤링페이퍼 만들기 창 띄우기');
    })
    .post((req, res) => {
        console.log('고유 id를 가진 롤링페이퍼 만들기');
    })
router.route('/:id')
    .get((req, res) => {
        const {edit} = req.query;
        if (edit) {
            console.log('게시글 작성 가능한 롤링페이퍼를 보여줌')
        }
        console.log('해당 id를 가진 롤링페이퍼를 보여줌');
    })
    .post((req, res) => {
        const {filter, deleting, edit} = req.query;
        if (filter) {
            console.log('필터링 단어 추가');
        }
        if (deleting) {
            console.log('게시글 삭제');
        }
        if (edit) {
            console.log('게시글 작성');
        }
    })
router.get('/:id/:post_id', (req, res) => {
    console.log('해당 롤링페이퍼의 특정 게시글을 보여줌');
})

module.exports = router;