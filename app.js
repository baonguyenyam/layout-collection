var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var viewsRouter = require('./routes/view');
var app = express();
var pug = require('pug');
var fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/:id', viewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function makeid(e) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < e; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function PugCom(a, b) {
  var outFileStream, parseFiles, writeToOutput;
  parseFiles = function (dirname) {
    var compiled, file, fileContents, filenames, i, pathv, len, results, stats;
    file = path.join(dirname)
    results = [];
    fileContents = fs.readFileSync(file, 'utf8');
    compiled = pug.compile(fileContents, {
      client: true,
      compileDebug: false,
      filename: file
    });
    writeToOutput(compiled, file.replace('.pug', ''))

    return results;
  };

  writeToOutput = function (fn, fnName) {
    var fnString;
    var id = makeid(10)
    fnString = fn.toString().replace('function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html +', "var " + id + " = ").replace('return pug_html;}', 'document.write(' + id + ');;')
    return outFileStream.write(fnString);
  };
  outFileStream = fs.createWriteStream(b, {
    flags: 'w'
  });
  parseFiles(a, b);
}
PugCom('./views/__index.pug', './views/__index.js')
PugCom('./views/__view.pug', './views/__view.js')

module.exports = app;
