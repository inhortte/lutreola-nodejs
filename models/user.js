module.exports = function(mongoose, mongooseAuth) {
  var collection = 'user';
  var Schema = mongoose.Schema;
  var schema = new Schema({
    login: String
  });
  var User;
  schema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
	User: function() {
	  return User;
	}
      }
    }
    , twitter: {
      everyauth: {
	consumerKey: 'tquSIHqPE7mfAn1YeA43bg'
	, consumerSecret: 'V7wbE8xccMmdQPK7AkuZdp9leDXjLFCGb8jKM4'
	, redirectPath: '/'
      }
    }
  });

  this.model = mongoose.model('User', schema, collection);
  return this;
}
