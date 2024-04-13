const Users = require("../models/Users");

const { sendBlank } = require("../utils/mailer");

const moment = require("jalali-moment");

module.exports.sendCode = async (req, res, next) => {
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
      `کد ارسال شده تا زمان ${date} قابل اسفتاده است \n ${randomNumber}`,
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
    const user = await Users.findOne({ _id: req.body.id, is_active: false });

    if (user == null) {
      const error = new Error(`کاربری با این آیدی پیدا نشد`);
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

    // 3: check if there is another users with this email
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
  } catch (error) {}
};
