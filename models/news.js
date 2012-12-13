module.exports = function(mongoose) {
  var collection = 'news';
  var Schema = mongoose.Schema;
  var News = new Schema({
    _id: Number,
    subject: String,
    image: String,
    en: Buffer,
    ee: Buffer,
    created_at: Date
  });
  News.static({
    paginate: function(page, amt, callback) {
      return this.find({}).sort({_id: -1}).skip(page * amt).limit(amt).exec(callback);
    }
  });
  this.model = mongoose.model('News', News, collection);
  return this;
}
