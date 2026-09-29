import crypto from 'crypto';
import jwt from 'jsonwebtoken';

function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || process.env.SECRET_KEY;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || process.env.SECRET_KEY;
}

export function signAccessToken(payload) {
  const secret = getAccessSecret();
  if (!secret) {
    throw new Error('JWT access secret is not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
  });
}

export function signRefreshToken(payload) {
  const secret = getRefreshSecret();
  if (!secret) {
    throw new Error('JWT refresh secret is not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
  });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function verifyRefreshToken(token) {
  const secret = getRefreshSecret();
  if (!secret) {
    throw new Error('JWT refresh secret is not configured');
  }

  return jwt.verify(token, secret);
}
