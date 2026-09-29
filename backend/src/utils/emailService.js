import nodemailer from 'nodemailer';
import 'dotenv/config';

function getEmailConfig() {
  const host = process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || 587);
  const user = process.env.SMTP_USER || process.env.BREVO_SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;
  const fromName = process.env.EMAIL_FROM_NAME || 'Zaika Restaurant';

  return {
    host,
    port,
    user,
    pass,
    from,
    fromName,
    secure: port === 465 || process.env.BREVO_SMTP_SECURE === 'true',
    brevoApiKey: process.env.BREVO_API_KEY
  };
}

async function sendViaBrevoApi({ to, subject, html, config }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': config.brevoApiKey
    },
    body: JSON.stringify({
      sender: { email: config.from, name: config.fromName },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });

  if (!response.ok) {
    throw new Error(`Brevo API send failed: ${response.status}`);
  }

  return true;
}

async function sendViaSmtp({ to, subject, html, config }) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });

  await transporter.sendMail({
    from: `${config.fromName} <${config.from}>`,
    to,
    subject,
    html
  });

  return true;
}

export default async function sendEmail(to, subject, html) {
  if (!to) throw new Error('Missing recipient email address');
  if (!subject || !html) throw new Error('Email subject and body are required');

  const config = getEmailConfig();
  if (!config.from) {
    throw new Error('Missing sender email. Set SMTP_FROM, EMAIL_FROM, or SMTP_USER.');
  }

  if (config.brevoApiKey && typeof fetch === 'function') {
    try {
      return await sendViaBrevoApi({ to, subject, html, config });
    } catch (error) {
      console.error('Brevo API email failed:', error.message);
    }
  }

  if (!config.host || !config.user || !config.pass) {
    throw new Error('SMTP config missing. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
  }

  return sendViaSmtp({ to, subject, html, config });
}
