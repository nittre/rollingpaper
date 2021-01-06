const express = require('express');
const router = express.Router({mergeParams: true});
const {User, Paper} = require('../models');
const {isLoggedIn, isNotLoggedIn, isItMe} = require('./middlewares');

router.get('/', isLoggedIn, isItMe, async (req, res, next) => {
    try {
        const error = req.query.error;
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
                papers,
                error
            })
        } else {
            res.render('main', {
                login: true,
                title: 'rollingpaper',
                user,
                papers,
                error
            })
        }
    } catch (err){
        console.error(err);
        next(err);
    }
})
router.route('/new')
    .get(isLoggedIn, isItMe, (req, res) => {
        const user = req.user;
        const error = req.query.error;
        res.render('new', {login: true, error, user});
    })
    .post((req, res) => {
        console.log(req.body);
        const {name, email} = req.body;
        const userId = req.user.user_id;
        Paper.create({
            name,
            email,
            userId
        }, {include: [User]})
        .then((paper)=> {
            console.log(paper.paper_id);
            return res.redirect(`/${req.user.user_id}/${paper.paper_id}?master=true`)
        })
        .catch((err) => {
            const message = '롤링페이퍼를 만들 수 없습니다.'
            console.error(err);
            return res.redirect(`/${req.user.user_id}/new?error=${message}`)
        })
    })
router.route('/:paper_id')
    .get(async (req, res) => {
        const {master, edit} = req.query;
        const {user_id, paper_id} = req.params;
        const paper = await Paper.findOne({
            where: { userId: user_id, paper_id: paper_id }
        });
        const user = await User.findOne({
            where: {user_id}
        });

        if (master) { // 계정주인이 접근할때
            return res.render('paper', {login: true, user, paper, master: true});
        } else if (edit) {  // edit URL로 들어왔을 때
            return res.render('paper', {login: true, user, paper, edit: true});
        } else {  // 일반 url로 들어왔을 때(수정x)
            return res.render('paper', {login: true, user, paper});
        }
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