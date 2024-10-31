const mailgen = require("mailgen");
const nodemailer = require("nodemailer");
const appConfig = require("../config/appConfig");



const Transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: appConfig.googleEmail,
    pass: appConfig.googleAppPassword,
  },
});

const RegisterUser = async (user, userEmail, token) => {

  try {
    const MAILGEN = new mailgen({
      theme: "default",
      product: {
        name: "Crestview Lodge",
        link: `${process.env.SITE_DOMAIN}`,
      },
    });
    const emailbody = {
      body: {
        name: user,
        intro: "Please verify your email",
        action: {
          instructions: "Tap the button below to confirm your email address. If you didn't create an account with Crestview Lodge, you can safely delete this email.",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm Account",
            link: `${process.env.SITE_DOMAIN}/auth/verification/?t=${token}`,
          },
        },
      },
    };
    const msg = MAILGEN.generate(emailbody);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Account verification",
      html: msg,
    };

    const res=await Transporter.sendMail(message,(err,info)=>{
      if(err){
        console.log({message:err})
      }
      if(info){
        console.log({messageInfo:info})
      }
    });
    console.log("send mail-",res)
    return true;
  } catch (error) {
    
  }
};

const ResetPass = async (email_user, token) => {
  try {
    let mailG = new mailgen({
      theme: "default",
      product: {
        name: "BaduTec",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });

    const email = {
      body: {
        name: email_user,
        intro: "we  are sorry for the stress",
        action: {
          instructions: "Please click below to reset your password",
          button: {
            color: "#1a73e8",
            text: "password reset link",
            link: `${process.env.SITE_DOMAIN}account/passwordreset?t=${token}`,
          },
        },
        outra: "you need any help?",
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: process.env.EMAIL,
      to: email_user,
      subject: "Password Reset",
      html: emailbody,
    };

    await Transporter.sendMail(message);
    return true;
  } catch (error) {
    
  }
};

const Contactmail = async (emails, msg) => {
  try {
    let mailG = new mailgen({
      theme: "default",
      product: {
        name: "Rixos Hotels",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },

    });


    const email = {
      body: {
        intro: ["Rixos Info"],
        outro: [`${msg}`],
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: process.env.EMAIL,
      to: `${emails}`,
      subject: "Rixos Hotel Communication",
      html: emailbody,
    };
    
    await Transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) {
    }
  }
};




const ContactmailClient = async (emails, msg,room) => {
  try {
    let mailG = new mailgen({
      theme: "default",
      product: {
        name: "Customer Support",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },

    });


    const email = {
      body: {
        intro: [`Quest in Room ${room} `],
        outro: [`${msg}`],
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: emails,
      to: `${process.env.EMAIL}`,
      subject: "Quest Enquries",
      html: emailbody,
    };
    
    await Transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) {
    }
  }
};




const RefundRequest = async (emails, msg,orderid) => {
  try {
    let mailG = new mailgen({
      theme: "default",
      product: {
        name: "Customer Support",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },

    });


    const email = {
      body: {
        intro: [`RESERVATION  REFUND FOR ORDER ID ${orderid} `],
        outro: [`${msg}`],
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: emails,
      to: `${process.env.EMAIL}`,
      subject: "Refund Request",
      html: emailbody,
    };
    
    await Transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) {
    }
  }
};

const sendmail = async (contact) => {
  try {
    let mailG = new Mailgen({
      theme: "default",
      product: {
        name: "My Id finder",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });

    const email = {
      body: {
        intro: [
          `Email:${contact.email}`,
          `firstname:${contact.firstname}`,
          `lastname:${contact.lastname}`,
        ],
        outro: [`${contact.message}`],
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: `${process.env.EMAIL}`,
      to: `${contact.email}`,
      subject: "Contact message",
      html: emailbody,
    };
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) {
      
    }
  }
};


module.exports = {
  RegisterUser,
  Contactmail,
  ResetPass,ContactmailClient,RefundRequest
};
