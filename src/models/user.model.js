var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
    email: { type: String, unique: true, index: true, lowercase: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: {type:String},
    address: {
      city: { type: String },
      street: { type: String },
    },
    email_verification: { type: Boolean, default: false },
    shortlists: { type: [] }, 
    username: { type: String, unique: true },
    gender: { type: String },
  },
  {
    usePushEach: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
var Model = mongoose.model('User', UserSchema);
module.exports = Model;
