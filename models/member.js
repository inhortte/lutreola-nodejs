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
  this.model = mongoose.model('Member', schema, collection);
  return this;
}
