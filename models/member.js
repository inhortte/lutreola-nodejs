var crypto = require('crypto');

module.exports = function(mongoose) {
  var collection = 'member';
  var Schema = mongoose.Schema;
  var schema = new Schema({
    _id: Number,
    username: String,
    email: String,
    encrypted_password: String,
    salt: String,
    auth_token: String,
    active: Boolean,
    last_action: Date,
    created_at: Date
  });
  schema.method({
    secureHash: function(s) {
      return(crypto.createHash('sha256')
	     .update(s, 'utf8').digest('hex'));
    },
    makeSalt: function(password) {
      return(this.secureHash(new Date().toJSON() + "--" + password));
    },
    encrypt: function(password) {
      return(this.secureHash(this.salt + "--" + password));
    },
    hasPassword: function(password) {
      return(this.encrypted_password == this.encrypt(password));
    }
  });
  schema.static({
    authenticate: function(username, password, callback) {
      this.findOne({$or:[{username:username}, {email:username}]},
		   function(err, member) {
		     if(!member) callback(null);
		     else if(member.hasPassword(password)) callback(member);
		     else callback(null);
		   });
    }
  });
  this.model = mongoose.model('Member', schema, collection);
  return this;
}
