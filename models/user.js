var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var validator       = require('validator');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(emailValue) {
        return validator.isEmail(emailValue)
      },
      message: 'Email is not valid'
    }
  },
  tcs: {
    type: String,
    required: true,
    validate: {
      validator: function(tcsValue) {
        return validator.equals(tcsValue, 'on');
      },
      message: 'Terms and Conditions were not accepted'
    }
  },
  hasSecureSetup: Boolean    
});
UserSchema.plugin(uniqueValidator);

var User = mongoose.model('User', UserSchema);

module.exports = User;
