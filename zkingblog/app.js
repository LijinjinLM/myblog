var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var db=require('./db'); //导入db模块
var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash=require('connect-flash');
var fs=require('fs');
//设置我们的app应用路由架构,引入各个功能模块对应的导航模块
var index = require('./routes/index');
var users = require('./routes/users');
var articles=require('./routes/articles');


var app = express();






// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie,对cookie加密
    key: settings.db,//key 的值为 cookie 的名字
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天
    resave:true,
    saveUninitialized:true,//是否保存初始化状态
    store: new MongoStore({ //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免重启服务器时会话丢失
//        db: settings.db,//设置session的信息保存到数据库中
//        host: settings.host,
//        port: settings.port
        url:settings.url
    })
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//用bodyParser解析post请求提交的数据
app.use(bodyParser.json());
//解析json数据;
//解析普通的数据  解析过后的数据放在req.body
app.use(bodyParser.urlencoded({ extended: false }));
//获取cookie
app.use(cookieParser());
//设置静态资源的路由
app.use(express.static(path.join(__dirname, 'public')));
//给require对象flase模块
app.use(flash());
//添加一个中间件，用来处理flash消息
app.use(function(req,res,next){
        res.locals.user=req.session.user;
    //是将session中保存的flash信息复制到response对象的locals属性中，这样才能在模板中显示
        res.locals.error=req.flash('error').toString();
        res.locals.success=req.flash('success').toString();
       //调用next（）放行请求
        next();
});
//路由映射  路由的设定应遵循restful设计原则
app.use('/', index);
app.use('/users', users);
app.use('/articles',articles);



// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render("404");
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
//正常日志
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
app.use(logger('dev',{stream: accessLog}));

//错误日志
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});
module.exports = app;
