const express = require('express');
const router = express.Router({mergeParams: true});
const {User, Paper} = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const user = await User.findOne({
            where: {user_id: userId},
            include: [{
                model: Paper,
            }]
        });
        const papers = await Paper.findAll({
            attributes: ['paper_id', 'name'],
            include: [{
                model: User,
                where: {
                    user_id: userId
                }
            }]
        });
        if (user) {
            res.render('main', {
                login: true,
                sns: user.provider,
                title: 'rollingpaper',
                user,
                papers
            })
        } else {
            res.render('main', {
                login: true,
                title: 'rollingpaper',
                user,
                papers
            })
        }
    } catch (err){
        console.error(err);
        next(err);
    }
})
router.route('/new')
    .get((req, res) => {
        console.log('새로운 롤링페이퍼 만들기 창 띄우기');
    })
    .post((req, res) => {
        console.log('고유 id를 가진 롤링페이퍼 만들기');
    })
router.route('/paper/:post_id')
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