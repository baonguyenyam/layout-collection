var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var crypto = require('crypto');
var Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, "./public/img/" + req.body.imgPath.trim());
	},
	filename: function (req, file, callback) {
		let type = 'jpg'
		if (file.mimetype === 'image/png') {
			type = 'png'
		} else if (file.mimetype === 'image/jpeg') {
			type = 'jpeg'
		} else {
			type = 'jpg'
		}
		callback(null, crypto.createHash('md5').update(Date.now() + "_" + removeVietnam(file.originalname.substring(0, 10))).digest('hex') + '.' + type);
	}
});
var upload = multer({
	storage: Storage
}).array(
	"imgUploader",
	10
);

function removeVietnam(s) {
	var r = s.toLowerCase().replace(/\s+/g, '-');
	non_asciis = {
		'-': '[`~!@#$%^&*()_|+=?;:",.<>/]',
		'a': '[ảàạảãàáâãäåắặẳằẵấầẩẫậâă]',
		'ae': 'æ',
		'c': 'ç',
		'e': '[èéẹẽẻềệếểễê]',
		'd': '[đ]',
		'i': '[ìíîïị]',
		'n': 'ñ',
		'o': '[òóôõöộồốổỗơởợỡờớôơ]',
		'oe': 'œ',
		'u': '[ùúûűüủụưửựứừữư]',
		'y': '[ýỳỷỵỹ]'
	};
	for (i in non_asciis) {
		r = r.replace(new RegExp(non_asciis[i], 'gi'), i);
	}
	r = r.replace(/[^\w\s]/gi, '-')
	return r
};

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Layout Collection by Bao Nguyen',
		route: 'Home'
	});
});


router.get('/getimg', function (req, res) {
	var path = require('path')
	var listIMGFull = []
	var listIMG = {}
	var lists = {}

	fromDir = function (startPath) {
		if (!fs.existsSync(startPath)) {
			return;
		}
		var files = fs.readdirSync(startPath);
		for (var i = 0; i < files.length; i++) {
			var filename = path.join(startPath, files[i]);
			var stat = fs.lstatSync(filename);
			if (stat.isDirectory()) {
				fromDir(filename); //recurse
			} else if (filename.indexOf('.png') >= 0 || filename.indexOf('.jpg') >= 0) {
				listIMGFull.push(filename.replace('public/', '/'))
			};
		};
		return listIMGFull
	};

	rmDir = function (dirPath) {
		try {
			var files = fs.readdirSync(dirPath);
		} catch (e) {
			return;
		}
		if (files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				var filePath = dirPath + '/' + files[i];
				if (fs.statSync(filePath).isDirectory()) {
					listIMG[files[i]] = []
				}
			}
		}
		return listIMG
	};

	lists.imgs = fromDir('./public/img')
	lists.lists = rmDir('./public/img')

	return res.end(JSON.stringify(lists));

})

router.post('/page/upload', function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			return res.end("error");
		}
		return res.end("done");
	});
})

module.exports = router;