const express = require('express');
const router = express.Router({mergeParams: true});
const {User, Paper, Post, Filter} = require('../models');
const {isLoggedIn, isNotLoggedIn, isItMe} = require('./middlewares');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
        const {name, email} = req.body;
        const userId = req.user.user_id;
        Paper.create({
            name,
            email,
            userId
        }, {include: [User]})
        .then((paper)=> {
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
        const filter_words = await Filter.findAll({where: {userId: user_id}, include: User, attributes: ['word', 'id']});
        for (word in filter_words) {
            const filter_word = '%'+filter_words[word].word+'%';
            await Post.findAll({ // 기존 글들 중 필터링 단어에 포함되는 게시글 숨김 처리
                where: {
                    text: {
                        [Op.like]: filter_word
                    }
                }
            })
            .then( async (posts) => {
                return posts.map(async (post, i, arr)=> {
                    post.show = 0;
                    await post.save();
                })
            })
        }
        
        const posts = await Post.findAll({attributes: ['text', 'id'], where: {'posts': paper_id, 'show': 1}});
        
        if (master) { // 계정주인이 접근할때
            if (req.isAuthenticated() && (req.user.user_id == user_id)){
                return res.render('paper', {login: true, user_id, paper, posts, filter_words, error: req.query.error, master: true});
            } else { //계정 주인이 아닌 사람이 접근할 때
                const message = '접근 권한이 없습니다.';
                return res.redirect(`/auth/login?loginError=${message}`);
            }
        } else if (edit) {  // edit URL로 들어왔을 때
            return res.render('paper', {login: true, user_id, paper, posts, error: req.query.error, edit: true});
        } else {  // 일반 url로 들어왔을 때(수정x)
            return res.render('paper', {login: true, user_id, paper, posts});
        }
    })
    .post(async (req, res, next) => {
        const {user_id, paper_id} = req.params;
        const {filter, deleting, edit} = req.query;
        if (filter) { 
            const words = req.body.words;
            const f_words = '%'+words+'%';
            if(words == '') {
                const message = '빈 단어는 필터링 할 수 없습니다';
                return res.redirect(`/${user_id}/${paper_id}?master=true&error=${message}`)
            }
            await Filter.create({  //필터링 단어 추가
                word: words,
                userId: user_id
            });
            await Post.findAll({ // 기존 글들 중 필터링 단어에 포함되는 게시글 숨김 처리
                where: {
                    text: {
                        [Op.like]: f_words
                    }
                }
            })
            .then((posts) => {
                return posts.map(async (post, i, arr)=> {
                    post.show = 0;
                    await post.save();
                })
            })
            .then(() => {
                return res.redirect(`/${user_id}/${paper_id}?master=true`);
            })
            .catch((err) => {
                console.error(err);
                const message = '필터링x';
                return res.redirect(`/${user_id}/${paper_id}?master=true?error=${message}`);
            })
            
        }
        if(deleting){
            const {post_id, word_id} = req.body;
            if (post_id) {
                await Post.destroy({
                    where: {id: post_id}
                })
                return res.redirect(`/${user_id}/${paper_id}?master=true`);
            }
            if (word_id) {
                await Filter.destroy({
                    where: {id: word_id, userId: user_id}
                })
                return res.redirect(`/${user_id}/${paper_id}?master=true`);
            }
        }
        if (edit) {
            const text = req.body.post;
            let f_word = '';
            await Filter.findAll({where: {userId: user_id}, attributes: ['word']})
                .then((filter_words) => {
                    for(w in filter_words) {
                        if(text.indexOf(filter_words[w].word) != -1) {
                            f_word = filter_words[w].word;
                            return;
                        }
                    }
                })
                .then(async () => {
                    if(f_word != '') {
                        const message = f_word+'는 사용할 수 없는 단어입니다.'
                        return res.redirect(`/${req.params.user_id}/${req.params.paper_id}?edit=true&error=${message}`);
                    }
                    else {
                        await Post.create({
                            text,
                            posts: paper_id,
                            show: 1
                        })
                        .then((post) => {
                            return res.redirect(`/${user_id}/${paper_id}?edit=true`);
                        })
                        .catch((err) => {
                            console.error(err);
                            const message = '롤링페이퍼를 작성할 수 없습니다';
                            return res.redirect(`/${user_id}/${paper_id}?edit=true?error=${message}`);
                        })
                    }
                })
                
            
        }
    })
router.post('/:paper_id/delete', isItMe, (req, res) => {
    Paper.destroy({
        where: {
            paper_id: req.params.paper_id
        }
    })
    .then(() => {
        return res.redirect(`/${req.params.user_id}/`)
    })
})

router.post('/:paper_id/open_post', (req, res) => {
    res.redirect(`/${req.params.user_id}/${req.params.paper_id}/${req.body.post_id}`);
})
router.get('/:paper_id/:post_id', (req, res) => {
    const {user_id, paper_id, post_id} = req.params;
    Post.findOne({where: {show: 1, posts: paper_id, id: post_id}})
    .then((paper) => {
        if(!paper) {
            if ((req.isAuthenticated()) && (req.user.user_id == user_id)) {
                return res.redirect(`/${user_id}/${paper_id}?master=true`);
            } else {
                return res.redirect(`/${user_id}/${paper_id}`);
            }
        } else {
            return res.render('page', {text: paper.text})
        }
    })
})

module.exports = router;