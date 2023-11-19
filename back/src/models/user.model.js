import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { AbilityBuilder, defineAbility } from '@casl/ability';
import toJSON from './plugins/toJSON.plugin.js';
import paginate from './plugins/paginate.plugin.js';

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    profilePicture: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Role',
      type: String,
      default: 'admin',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      required: false,

    },
    days: [{ type: mongoose.Schema.Types.ObjectId, ref: "Day" }],
    devices: [
      {
        credentialID: {
          type: String,
        },
        credentialPublicKey: {
          type: String,
        },
        counter: {
          type: Number,
        },
        transports: {
          type: [String],
        },
        deviceInfo: {
          browser: {
            type: Object,
          }, // { name: 'Chrome', version: '87.0.4280.88' }
          device: {
            type: Object,
          }, // { vendor: 'Google', model: 'Chromebook', type: 'desktop' }
          os: {
            type: Object,
          }, // { name: 'Chrome OS', version: '87.0.4280.88' }
        },
        createdAt: {
          type: Date,
        },
        location: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * Define the user's abilities using CASL
 * @param {Array} rules - The rules for the user's abilities
 * @returns {Ability}
 */
userSchema.methods.defineAbilities = function (rules) {
  const { can, cannot, build } = new AbilityBuilder(defineAbility);

  // Define the user's abilities
  rules.forEach((rule) => {
    const actions = rule.actions.includes('manage') ? ['create', 'read', 'update', 'delete'] : rule.actions;
    const subject = rule.subject === 'all' ? 'all' : `${rule.subject}`;
    if (rule.inverted) {
      cannot(actions, subject);
    } else {
      can(actions, subject);
    }
  });

  // Return the user's abilities
  return build();
};

userSchema.virtual('ability').get(() => {
  return [
    {
      action: 'manage',
      subject: 'all',
    },
  ];
});

userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;
