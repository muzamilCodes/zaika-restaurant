import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: String,
    userAgent: String,
    expiresAt: Date
  },
  { timestamps: true, _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
      }
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    savedAddresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    refreshTokens: [refreshTokenSchema],
    resetPasswordTokenHash: String,
    resetPasswordExpiresAt: Date
  },
  { timestamps: true }
);

userSchema.pre('save', function syncAdminFields(next) {
  if (typeof this.role === 'string') {
    this.role = this.role.trim().toLowerCase();
  }

  if (this.isAdmin === true || this.role === 'admin') {
    this.role = 'admin';
    this.isAdmin = true;
  } else {
    this.isAdmin = false;
  }

  next();
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
