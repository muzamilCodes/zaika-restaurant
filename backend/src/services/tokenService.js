import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token.js';

export function issueTokenPair(user) {
  const normalizedRole =
    typeof user.role === 'string' &&
    user.role.replace(/["']/g, '').trim().toLowerCase().includes('admin')
      ? 'admin'
      : user.isAdmin === true
        ? 'admin'
        : 'customer';

  const payload = {
    id: user._id.toString(),
    role: normalizedRole,
    isAdmin: normalizedRole === 'admin',
    email: user.email
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    refreshTokenHash: hashToken(refreshToken)
  };
}

export function decodeRefreshToken(token) {
  return verifyRefreshToken(token);
}
