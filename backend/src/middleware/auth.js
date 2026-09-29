import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

function getAuthSecret() {
  return process.env.JWT_ACCESS_SECRET || process.env.SECRET_KEY;
}

function normalizeRole(role, isAdmin) {
  const cleanedRole = typeof role === 'string' ? role.replace(/["']/g, '').trim().toLowerCase() : '';
  if (cleanedRole === 'admin' || cleanedRole.includes('admin') || isAdmin === true) return 'admin';
  if (cleanedRole === 'customer' || cleanedRole.includes('customer')) return 'customer';
  return undefined;
}

// ESM-compatible named exports used by routes/authRoutes.js and routes/userRoutes.js
export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided'
      });
    }

    const secret = getAuthSecret();
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Auth secret is not configured'
      });
    }

    const decoded = jwt.verify(token, secret);

    // Keep backwards-compatible properties used across controllers
    req.userId = decoded.userId || decoded.id;

    const dbUser = await User.findById(req.userId).select('role isAdmin');
    const normalizedRole = normalizeRole(decoded.role || dbUser?.role, dbUser?.isAdmin);

    // populate req.user so controllers that expect req.user._id work
    req.role = normalizedRole;
    req.user = {
      _id: req.userId,
      role: normalizedRole,
      isAdmin: normalizedRole === 'admin'
    };
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// authorize('admin') => middleware that checks role
export const authorize = (role) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    if (req.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    next();
  };
};
