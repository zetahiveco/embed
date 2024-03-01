import nodemailer from "nodemailer";


export async function sendEmail(to: string, subject: string, html: string) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        secure: true,
        port: parseInt(process.env.SMTP_PORT as string),
        auth: {
            user: process.env.SMTP_USER as string,
            pass: process.env.SMTP_PASSWORD as string
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: to,
        subject: subject,
        html: html
    })

    return;
}
