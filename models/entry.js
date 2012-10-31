module.exports = function(mongoose) {
  var collection = 'entry';
  var Schema = mongoose.Schema;
  var schema = new Schema({
    _id: Number,
    title: String,
    role: String,
    main_menu: Number,
    url: String,
    en: Buffer,
    ee: Buffer
  });
  this.model = mongoose.model('Entry', schema, collection);
  return this;
}
