var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  res.render('view', { title: 'Layout Collection by Bao Nguyen', route: id.charAt(0).toUpperCase() + id.slice(1) });
});

router.get('/getimg/:id', function (req, res) {
  var id = req.params.id;
  var lists = {
    lists: []
  }
  var listIMG = []
  rmDirFiles = function (dirPath) {
    try { var files = fs.readdirSync(dirPath); }
		catch (e) { return; }
		if (files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				var filePath = dirPath + '/' + files[i];
				if (fs.statSync(filePath).isFile()) {
					if (filePath.indexOf(".png") > -1 || filePath.indexOf(".jpg") > -1 || filePath.indexOf(".jpeg") > -1) {
						listIMG.push(files[i])
					}
				} else {
					rmDirFiles(filePath);
				}
      }
      lists.lists = listIMG
		} 
		return JSON.stringify(lists)
  };
	return res.end(rmDirFiles('./public/img/'+id));
})

module.exports = router;
