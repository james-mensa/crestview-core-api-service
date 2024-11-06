import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { appConfig } from "@config/appConfig";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private mailgen: Mailgen;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: appConfig.googleEmail,
        pass: appConfig.googleAppPassword,
      },
    });

    this.mailgen = new Mailgen({
      theme: "default",
      product: {
        name: "My Service",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });
  }

  private async sendMail(message: MailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail(message);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  public async registerUser(user: string, userEmail: string, token: string): Promise<boolean> {
    const emailBody = {
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

    const msg = this.mailgen.generate(emailBody);
    const message: MailOptions = {
      from: process.env.EMAIL!,
      to: userEmail,
      subject: "Account Verification",
      html: msg,
    };

    return await this.sendMail(message);
  }

  public async resetPassword(emailUser: string, token: string): Promise<boolean> {
    const email = {
      body: {
        name: emailUser,
        intro: "We are sorry for the stress",
        action: {
          instructions: "Please click below to reset your password",
          button: {
            color: "#1a73e8",
            text: "Password Reset Link",
            link: `${process.env.SITE_DOMAIN}/account/passwordreset?t=${token}`,
          },
        },
        outro: "Do you need any help?",
      },
    };

    const emailBody = this.mailgen.generate(email);
    const message: MailOptions = {
      from: process.env.EMAIL!,
      to: emailUser,
      subject: "Password Reset",
      html: emailBody,
    };

    return await this.sendMail(message);
  }

  public async contactMail(emails: string, msg: string): Promise<boolean> {
    const email = {
      body: {
        intro: ["Rixos Info"],
        outro: [`${msg}`],
      },
    };

    const emailBody = this.mailgen.generate(email);
    const message: MailOptions = {
      from: process.env.EMAIL!,
      to: emails,
      subject: "Rixos Hotel Communication",
      html: emailBody,
    };

    return await this.sendMail(message);
  }

  public async contactMailClient(emails: string, msg: string, room: string): Promise<boolean> {
    const email = {
      body: {
        intro: [`Quest in Room ${room}`],
        outro: [`${msg}`],
      },
    };

    const emailBody = this.mailgen.generate(email);
    const message: MailOptions = {
      from: emails,
      to: `${process.env.EMAIL!}`,
      subject: "Quest Inquiries",
      html: emailBody,
    };

    return await this.sendMail(message);
  }

  public async refundRequest(emails: string, msg: string, orderId: string): Promise<boolean> {
    const email = {
      body: {
        intro: [`RESERVATION REFUND FOR ORDER ID ${orderId}`],
        outro: [`${msg}`],
      },
    };

    const emailBody = this.mailgen.generate(email);
    const message: MailOptions = {
      from: emails,
      to: `${process.env.EMAIL!}`,
      subject: "Refund Request",
      html: emailBody,
    };

    return await this.sendMail(message);
  }

  public async sendContactMessage(contact: { email: string; firstname: string; lastname: string; message: string }): Promise<boolean> {
    const email = {
      body: {
        intro: [
          `Email: ${contact.email}`,
          `First Name: ${contact.firstname}`,
          `Last Name: ${contact.lastname}`,
        ],
        outro: [`${contact.message}`],
      },
    };

    const emailBody = this.mailgen.generate(email);
    const message: MailOptions = {
      from: `${process.env.EMAIL!}`,
      to: `${contact.email}`,
      subject: "Contact Message",
      html: emailBody,
    };

    return await this.sendMail(message);
  }
}

export default new EmailService();
