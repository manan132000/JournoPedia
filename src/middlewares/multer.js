const multer = require("multer");
const ARTICLE_UPLOAD_PATH = process.env.ARTICLE_UPLOAD_PATH;
const IMAGE_UPLOAD_PATH = process.env.IMAGE_UPLOAD_PATH;

function uniqueKey (length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random()*charactersLength));
   }
   return result;
}

const articleStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, ARTICLE_UPLOAD_PATH);
    },
    filename: function(req, file, cb) {
        let fileNameArray = (file.originalname.split('.'));
        let ext = fileNameArray[fileNameArray.length-1];
        let key = uniqueKey(8);
        cb(null, file.fieldname + key + '.' + ext);
    }
});

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, IMAGE_UPLOAD_PATH);
    },
    filename: function(req, file, cb) {
        let fileNameArray = (file.originalname.split('.'));
        let ext = fileNameArray[fileNameArray.length-1];
        let key = uniqueKey(8);
        cb(null, file.fieldname + key + '.' + ext);
    }
});

const articleFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const articleUpload = multer({
    storage: articleStorage,
    limits: {
        filesize: 1024 * 1024 * 2
    },
    fileFilter: articleFileFilter
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        filesize: 1024 * 1024 * 10
    },
    fileFilter: imageFileFilter
});

module.exports = {articleUpload, imageUpload};
  