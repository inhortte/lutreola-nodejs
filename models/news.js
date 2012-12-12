module.exports = function(mongoose) {
  var collection = 'news';
  var Schema = mongoose.Schema;
  var schema = new Schema({
    _id: Number,
    subject: String,
    image: String,
    en: Buffer,
    ee: Buffer,
    created_at: Date
  });
  this.model = mongoose.model('News', schema, collection);
  return this;
}
