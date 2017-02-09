
var express = require('express');

var bodyParser = require('body-parser');

// cookie中间件
var cookieParser = require('cookie-parser');

// session中间件
var session = require('express-session');

var app = express();

// 指定模板放在哪里了？
app.set('views', './views');
// 指定使用哪个模板引擎
app.set('view engine', 'xtpl');

// 应用cookie中间件
// 此中间件就会在响应中设置cookie方法，下次访问的时候服务器就知道你已经访问过了，直接帮你登录
app.use(cookieParser());

// 应用session中间件
// 请求上添加一个属性session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  cookie: {maxAge: 60 * 60 * 24}
}));

// 解析 application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// 设置目录，响应回静态资源
app.use('/', express.static('public'));
app.use('/', express.static('uploads'));

app.use(function (req, res,next) {
	var url = req.originalUrl;

	// express提供一个全局的对象app.locals
	// 在些对象的数据可以任何视图上获得
	// 登录信息
	var loginfo = req.session.loginfo;
	// 将登陆信息保存在全局对象上
	app.locals.loginfo = loginfo;
	
	if(url != '/login' && !loginfo) {
		return res.redirect('/login');
	}

	next();
});

// 以下各个模块分别担负着自己对应的功能，(根据请求，匹配对应的路由，渲染对应的页面，处理对应的数据数据 
// 仪表盘模块，首页展示，个人中心，头像上传，密码修改，保存到数据库
var index = require('./controllers/index');
// 用户模块，包括展示用户列表，查看用户两个功能
var user = require('./controllers/user');
//教师管理，教师列表展示，添加教师，查看教师，教师编辑，注销，
var teacher = require('./controllers/teacher');
//登录模块，登录页面展示，用户登录验证，通过cookie和session的配合
var login = require('./controllers/login');
//课程管理模块：1：课程添加(分四步，创建课程，基本信息，课程图片，课时管理)，
//2：课程列表展示
//3：课程分类 （课程分类页面展示，添加分类，编辑，删除）
var course = require('./controllers/course');

// 根据路由匹配对应的控制器
app.use('/', index);
app.use('/user', user);
app.use('/teacher', teacher);
app.use('/login', login);
app.use('/course', course);

app.listen(3000);