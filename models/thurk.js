module.exports = function(mongoose) {
  var collection = 'thurk';
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.SchemaTypes.ObjectId;
  var schema = new Schema({
    mustelid: ObjectId,
    genus: String,
    species: String,
    birthdate: Date
  });
  this.model = mongoose.model('Thurk', schema, collection);
  return this;
}
