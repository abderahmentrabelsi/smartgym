import mongoose from 'mongoose';
import toJSON from './plugins/toJSON.plugin.js';
import paginate from "./plugins/paginate.plugin.js";

const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Array,
      required: false,
    },
    createdDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
permissionSchema.plugin(toJSON);
permissionSchema.plugin(paginate);

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
