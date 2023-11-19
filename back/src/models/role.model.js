import mongoose from 'mongoose';
import { defineAbility, ForbiddenError } from '@casl/ability';
import toJSON from './plugins/toJSON.plugin.js';
import paginate from './plugins/paginate.plugin.js';
import Permission from './permission.model.js';

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
  },
  {
    timestamps: true,
  }
);

roleSchema.plugin(toJSON);

roleSchema.methods.ability = async function () {
  const { permissions } = this;
  const rejectedActions = [];

  const rules = await Permission.find({ _id: { $in: permissions } })
    .select('action subject conditions')
    .lean()
    .exec()
    .map(({ action, subject, conditions }) => {
      const Model = mongoose.models[subject];
      if (Model) {
        return {
          action,
          subject,
          conditions,
        };
      }
      rejectedActions.push(`${action} ${subject}`);
      return null;
    })
    .filter(Boolean);

  const ability = defineAbility((can) => {
    rules.forEach(({ action, subject, conditions }) => {
      can(action, subject, conditions);
    });
  });

  if (rejectedActions.length > 0) {
    const message = `The following actions are not permitted: ${rejectedActions.join(
      ', '
    )}`;
    throw new ForbiddenError(message);
  }

  return ability;
};

const Role = mongoose.model('Role', roleSchema);

export default Role;
