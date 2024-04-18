const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const Mailgen = require("mailgen");

const transportDetails = smtpTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const transporter = nodemailer.createTransport(transportDetails);

function manageWebsite() {
  let website;
  if (process.env.NODE_ENV == "development") {
    website = "http://localhost:8080";
  } else {
    website = "http://telegrammeli.amirmohammadgharibi.ir/";
  }
  return website;
}

module.exports.sendMail = async (email, username, subject, instructions, buttonLink, buttonText, outro, wait) => {
  try {
    let mailGenerator = new Mailgen({
      textDirection: "rtl",
      theme: "default",
      product: {
        link: manageWebsite(),
        name: "تلگرام ملی",
        copyright: "حق کپی رایت این سامانه متعلق به تلگرام ملی میباشد",
      },
    });

    let template = {
      body: {
        name: username,
        signature: false,
        greeting: "سلام",
        intro: "از اینکه از  تلگرام ملی استفاده میکنید ممنونیم",
        action: {
          instructions,
          button: {
            color: "#22BC66",
            text: buttonText,
            link: `${manageWebsite()}${buttonLink}`,
          },
        },
        outro,
      },
    };

    if (wait == true) {
      let mail = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject,
        html: mailGenerator.generate(template),
      });
      return {
        id: mail.messageId,
        status: 200,
      };
    } else {
      let mail = transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject,
        html: mailGenerator.generate(template),
      });
      return {
        id: mail.messageId,
        status: 200,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendBlank = async (email, username, subject, intro, outro, wait) => {
  try {
    let mailGenerator = new Mailgen({
      textDirection: "rtl",
      theme: "default",
      product: {
        link: manageWebsite(),
        name: "تلگرام ملی",
        copyright: "حق کپی رایت این سامانه متعلق به تلگرام ملی میباشد",
      },
    });

    let template = {
      body: {
        name: username,
        signature: false,
        greeting: "سلام",
        intro,
        outro,
      },
    };

    if (wait == true) {
      let mail = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject,
        html: mailGenerator.generate(template),
      });
      return {
        id: mail.messageId,
        status: 200,
      };
    } else {
      let mail = transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject,
        html: mailGenerator.generate(template),
      });
      return {
        id: mail.messageId,
        status: 200,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      code: error.code,
      status: 400,
    };
  }
};
