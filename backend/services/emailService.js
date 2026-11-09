import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export async function sendPasswordResetEmail(email, token) {
    const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Recuperação de senha - Vagas Nordestinas',

        html: `
            <h2>Recuperação de senha</h2>

            <p>Recebemos uma solicitação para redefinir sua senha.</p>

            <p>
                <a href="${resetUrl}">
                    Redefinir minha senha
                </a>
            </p>

            <p>Este link expira em 30 minutos.</p>

            <p>Se você não solicitou essa alteração,
            ignore este e-mail.</p>
        `
    });
}