module.exports = function(mongoose) {
  var collection = 'menu';
  var Schema = mongoose.Schema;
  var schema = new Schema({
    _id: Number,
    name: String,
    default_page_id: Number,
    parent_id: Number
  });
  this.model = mongoose.model('Menu', schema, collection);
  return this;
}
