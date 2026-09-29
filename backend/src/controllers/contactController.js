import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { ContactMessage } from '../models/ContactMessage.js';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().trim().toLowerCase(),
  message: z.string().min(10)
});

export const sendContactMessage = asyncHandler(async (req, res) => {
  const body = contactSchema.parse(req.body);
  const supportEmail =
    process.env.CONTACT_TO_EMAIL ||
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    process.env.BREVO_SMTP_USER;

  let emailSent = false;
  if (supportEmail) {
    try {
      await sendEmail({
        to: supportEmail,
        subject: `Zaika contact request from ${body.name}`,
        html: `<p><strong>Name:</strong> ${body.name}</p><p><strong>Email:</strong> ${body.email}</p><p><strong>Message:</strong></p><p>${body.message}</p>`
      });
      emailSent = true;
    } catch (err) {
      console.error('Contact email error:', err?.message || err);
    }
  }

  await ContactMessage.create({
    ...body,
    emailSent
  });

  res.status(201).json({
    success: true,
    emailSent,
    message: emailSent
      ? 'Your message has been sent successfully.'
      : 'Your message has been received. Our team will contact you soon.'
  });
});

export const listContactMessages = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ messages });
});

export const markContactMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: 'read' },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ message: 'Contact message not found' });
  }

  res.json({ message });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).json({ message: 'Contact message not found' });
  }

  res.json({ message: 'Contact message deleted' });
});
