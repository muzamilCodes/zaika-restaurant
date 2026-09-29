import emailService from './emailService.js';

export async function sendEmail({ to, subject, html }) {
  if (!to) {
    throw new Error('Recipient email address is required');
  }

  if (!subject || !html) {
    throw new Error('Email subject and body are required');
  }

  return emailService(to, subject, html);
}
