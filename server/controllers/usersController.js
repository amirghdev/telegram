const Users = require("../models/Users");

const { sendBlank } = require("../utils/mailer");

const moment = require("jalali-moment");
const { customAlphabet } = require("nanoid");
const jwt = require("jsonwebtoken");
const Tokens = require("../models/Tokens");

module.exports.sendRegisterCode = async (req, res, next) => {
  try {
    // 1: validate email
    if (req.body.email == "" || req.body.email == undefined || req.body.email == null) {
      const error = new Error("لطفا ایمیل را وارد کنید");
      error.statusCode = 422;
      throw error;
    }

    // 2: check email
    const checkUser = await Users.findOne({ email: req.body.email, is_active: true });
    if (checkUser != null) {
      const error = new Error("کاربری از قبل با این ایمیل وجود دارد");
      error.statusCode = 403;
      throw error;
    }

    // 3: generate random code and expire
    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const expire = Date.now() + 1000 * 60 * 5;

    // 4: create user with email and code
    const user = await Users.create({ email: req.body.email, code: { code: randomNumber, expire } });

    // 5: wait for email to send
    const date = moment(expire).locale("fa").format("HH:mm:ss");
    let sendEmail = await sendBlank(
      req.body.email,
      false,
      "ساخت اکانت تلگرام",
      `کد ارسال شده تا زمان ${date} قابل اسفتاده است <br> ${randomNumber}`,
      "اگر شما این درخواست را نداده اید لطفا این درخواست را نادیده بگیرید",
      true
    );

    if (sendEmail.status == 400) {
      const message = sendEmail.code == "EENVELOPE" ? "آدرس ایمیل پیدا نشد" : "مشکلی در ارسال ایمیل وجود دارد";
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({ message: "ایمیل ارسال شد", id: user._id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.validateCode = async (req, res, next) => {
  try {
    // 1: find user with id and check if is_active is false
    const user = await Users.findOne({ _id: req.body.id });

    if (user == null) {
      const error = new Error(`کاربری با این آیدی پیدا نشد`);
      error.statusCode = 404;
      throw error;
    }

    // 2: check if user is already active
    if (user.is_active == true) {
      const error = new Error("اکانت شما از قبل تایید شده است");
      error.statusCode = 403;
      throw error;
    }

    // 3: validate code
    if (req.body.code != user.code.code) {
      const error = new Error("کد وارد شده اشتباه است");
      error.statusCode = 400;
      throw error;
    }

    // 4: check expire
    if (user.code.expire < Date.now()) {
      const error = new Error("زمان کد شما تمام شده است");
      error.statusCode = 422;
      throw error;
    }

    // 5: check if there is another users with this email
    const users = await Users.find({ email: req.body.id, is_active: false });

    // delete all not active users
    if (user.length > 0) {
      users.forEach(async (u) => {
        await Users.deleteOne({ _id: u._id });
      });
    }

    user.is_active = true;
    await user.save();

    res.status(200).json({ message: "کاربر با موفقیت تایید شد" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    // 1: find user with id and check if is_active is false
    const user = await Users.findOne({ _id: req.body.id });

    if (user == null) {
      const error = new Error(`کاربری با این آیدی پیدا نشد`);
      error.statusCode = 404;
      throw error;
    }

    // 2: user must be active
    if (user.is_active == false) {
      const error = new Error("کاربر هنوز فعال نشده است");
      error.statusCode = 403;
      throw error;
    }

    if (user.user_id != undefined) {
      const error = new Error("کاربر از قبل ثبت نام شده است");
      error.statusCode = 403;
      throw error;
    }

    // 3: check for name
    if (req.body.name == "" || req.body.name == undefined || req.body.name == null) {
      const error = new Error("لطفا نام خود را وارد کنید");
      error.statusCode = 422;
      throw error;
    }

    const nanoid = customAlphabet("1234567890", 18);

    user.name = req.body.name;
    user.user_id = nanoid();
    await user.save();

    res.status(200).json({ message: `${req.body.name} ثبت نام شما با موفقیت انجام شد`, user });
  } catch (error) {
    next(error);
  }
};

module.exports.sendLoginCode = async (req, res, next) => {
  try {
    // 1: check for email
    if (req.body.email == "" || req.body.email == undefined || req.body.email == null) {
      const error = new Error("لطفا ایمیل را وارد کنید");
      error.statusCode = 422;
      throw error;
    }

    // 2: find user
    const user = await Users.findOne({ email: req.body.email, is_active: true, user_id: { $ne: undefined } });

    if (user == null) {
      const error = new Error(`کاربری با ایمیل وارد شده وجود ندارد`);
      error.statusCode = 404;
      throw error;
    }

    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const expire = Date.now() + 1000 * 60 * 5;
    const date = moment(expire).locale("fa").format("HH:mm:ss");

    // 3: send email
    let sendEmail = sendBlank(
      user.email,
      user.name,
      "ورود به اکانت تلگرام",
      `کد ارسال شده تا زمان ${date} قابل اسفتاده است <br> ${randomNumber}`,
      "اگر شما این درخواست را نداده اید لطفا این درخواست را نادیده بگیرید",
      false
    );

    if (sendEmail.status == 400) {
      const error = new Error("مشکلی در ارسال ایمیل وجود دارد");
      error.statusCode = 400;
      throw error;
    }

    // 4: update user
    user.code.code = randomNumber;
    user.code.expire = expire;
    await user.save();

    res.status(200).json({ message: "بزودی ایمیل برای شما ارسال می شود", user_id: user._id });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const user = await Users.findById(req.body.user_id);

    // 1: check for user
    if (user == null) {
      const error = new Error(`کاربری در پایگاه داده پیدا نشد`);
      error.statusCode = 404;
      throw error;
    }

    // 2: validate code
    if (req.body.code != user.code.code) {
      const error = new Error("کد وارد شده اشتباه است");
      error.statusCode = 400;
      throw error;
    }

    // 3: check expire
    if (user.code.expire < Date.now()) {
      const error = new Error("زمان کد شما تمام شده است");
      error.statusCode = 422;
      throw error;
    }

    const { email, name, user_id } = user;

    const token = jwt.sign({ email, name, user_id, id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "30d", noTimestamp: true });

    await Tokens.create({
      token,
      user_id: user._id,
    });

    res.status(200).json({ message: "کاربر با موفقیت وارد شد", token });
  } catch (error) {
    next(error);
  }
};

module.exports.auth = async (req, res, next) => {
  try {
    if (req.body.token == "" || req.body.token == undefined || req.body.token == null) {
      const error = new Error("لطفا توکن را وارد کنید");
      error.statusCode = 422;
      throw error;
    }

    const token = await Tokens.findOne({ token: req.body.token });

    if (token == null) {
      const error = new Error("توکن در پایگاه داده پیدا نشد");
      error.statusCode = 422;
      throw error;
    }

    jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        err.statusCode = 401;
        throw err;
      }

      res.status(200).json({ user });
    });
  } catch (error) {
    next(error);
  }
};
