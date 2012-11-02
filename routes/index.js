var fs = require('fs');

module.exports = function(){
  fs.readdirSync(__dirname).forEach(function(file) {
    if(file == "index.js" || file == "general.js") return;
    if(/\.js$/.exec(file)) {
      var name = file.substr(0, file.indexOf('.'));
      console.log('attempting to require ' + name);
      require('./' + name)();
    }
  });
}
