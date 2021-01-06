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
        const user = req.user;
        res.render('new', {login: true, user});
    })
    .post((req, res) => {
        const {name, email} = req.body;
        const userId = req.user.user_id;
        const newPaper = Paper.create({
            name,
            email,
            userId
        }, {include: [User]})
        .then((paper)=> {
            return res.redirect(`/${req.user.user_id}/${paper}`)
        });
    })
router.route('/:paper_id')
    .get((req, res) => {
        const {edit} = req.query;
        Paper.findOne({
            where: { userId: req.user.user_id }
        })
        .then((paper) => {
            return res.render('paper', {login: true, paper});
        })
        
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
router.get('/:paper_id/:post_id', (req, res) => {
    console.log('해당 롤링페이퍼의 특정 게시글을 보여줌');
})

module.exports = router;