var express = require('express');
var path = require('path');
var fs = require('fs');
var multer  = require('multer');

var app = express();

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './kf0/index.files';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        // '-' + Date.now() +
        cb(null, file.fieldname + '.jpg');
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'kf0')));


// 单图上传
app.post('/upload', upload.single('logo'), function(req, res, next){
    var file = req.file;

    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);

    res.redirect('/')
});


app.get('/form', function(req, res, next){
    var form = fs.readFileSync('./kf0/form.html', {encoding: 'utf8'});
    res.send(form);
});


app.listen(8080, () => {
    console.log(`App listening at port 8080`)
})
