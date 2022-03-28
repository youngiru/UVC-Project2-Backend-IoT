const express = require('express');

const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const logger = require('../lib/logger');
const tokenUtil = require('../lib/tokenUtil');
const userService = require('../service/userService');

// 등록
router.post('/', async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
      password: req.body.password,
      name: req.body.name,
      rank: req.body.rank,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      active: req.body.active || true,
    };
    logger.info(`(user.req.params) ${JSON.stringify(this.params)}`);

    // 입력값 null 체크
    if (!params.name || !params.userid || !params.password) {
      const err = new Error('Not allowed null (name, userid, password)');
      logger.error(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    // const result = await userService.register(params);
    // logger.info(`(user.reg.result) ${JSON.stringify(result)}`);

    const hash = await bcrypt.hash(params.password, 12);
    const result = await User.create({
      userid: params.userid,
      password: hash,
    });
    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// 리스트 조회
router.get('/', async (req, res) => {
  try {
    const params = {
      name: req.query.name,
      userid: req.query.userid,
    };
    logger.info(`(user.list.params) ${JSON.stringify(params)}`);

    const result = await userService.list(params);
    logger.info(`(user.list.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

module.exports = router;
