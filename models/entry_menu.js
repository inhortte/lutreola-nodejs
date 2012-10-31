module.exports = function(mongoose) {
  var collection = 'entry_menu';
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.SchemaTypes.ObjectId;
  var schema = new Schema({
    _id: ObjectId,
    ordr: { type: Number, default: 1 },
    title: String,
    menu_id: Number,
    entry_id: Number
  });
  this.model = mongoose.model('EntryMenu', schema, collection);
  return this;
}
