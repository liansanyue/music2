var fs = require('fs');
var crypto = require('crypto');
var User = require("../models/user.js");
var Love = require("../models/love.js");
var Music = require("../models/music.js");
module.exports = function(app) {
    app.get('/', function(req, res) {
        var loves;
        User.get(req.session.username, function(err, user) {
            if (!user) {
                loves=[]
            }
             else{
               loves=user.loves; 
             }
            res.render("index", {
                user: req.session.user,
                loves: loves,
                name: req.session.username,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        })
    });
    app.get('/login',checkNotLogin);
    app.get('/login', function(req, res) {

        res.render('login');

    });
     app.post('/login',checkNotLogin);
     app.post('/login', function(req, res) {
        //生成密码MD5的值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        var newUser = new User({
            name: req.body.name.trim(),
            password: password

        });
        User.get(newUser.name, function(err, user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('/login')
            }
            if (user.password != password) {
                req.flash('error', '密码错误');
                return res.redirect('/login');
            }
            req.session.username = newUser.name;
            req.session.user = user;
            req.flash('success', '登陆成功');
            console.log("登录成功");
            res.redirect('/');
        })

    });
    app.get('/logout',checkLogin);
    app.get("/logout", function(req, res) {
        req.session.user = null;
        req.session.username = null;
        req.flash('success', '注销成功');
        res.redirect('/');
    });
    app.get('/reg',checkNotLogin);
    app.get('/reg', function(req, res) {

        res.render('reg');

    });
    app.post('/reg',checkNotLogin);
    app.post('/reg', function(req, res) {
        var name = req.body.name.trim() == "" ? req.body.email : req.body.name.trim();
        password = req.body.password,
            password_re = req.body.repassword;
        //检验用户两次输入的密码是否一致

        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致');
            return res.redirect('/res'); //返回注册页
        }
        //生成密码的MD5值

        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name.trim() == "" ? req.body.email : req.body.name.trim(),
            password: password,
            email: req.body.email,
            ip: req.connection.remoteAddress
        });
        // 检查用户是否已经存在
        User.getIpUser(newUser.ip, function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/')
            }
            
            if (user.length > 19) {

                req.flash('error', '你已经注册过20个用户啦')
                return res.redirect('/reg'); //返回注册页
            }

            User.get(newUser.name, function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/')
                }
                if (user) {

                    req.flash('error', '用户已经存在')
                    return res.redirect('/reg'); //返回注册页
                }

                //如果不存在则新增用户
                newUser.save(function(err, user) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/reg'); //注册失败返回注册
                    }
                    req.session.username = newUser.name;
                    req.session.user = user;
                    req.flash('success', '注册成功');
                    res.redirect('/');

                });
            });
        })
    });
    app.get('/upload',checkLogin);
    app.get('/upload', function(req, res) {
        if(req.session.username=="admin"){
        res.render('upload');}
        else{
         res.redirect("/")}

    });
    app.post('/upload',checkLogin);
    app.post('/upload', function(req, res) {
        var str = req.files.music.name;


        filename = str.slice(0, str.indexOf('.'))
        var language="";
        if(req.body.language=="1")language="华语";
        if(req.body.language=="2")language="日韩";
        if(req.body.language=="3")language="欧美";
        var tags = [language, req.body.tag1, req.body.tag2, req.body.tag3];
        var music = new Music(req.session.username, req.body.songname, req.body.singername, tags, req.body.publish, filename);
        music.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            console.log('success!')
                // req.flash('success', '发布成功');
            res.redirect('/upload');
        })
    });
   
    app.get("/search",function(req,res){
        res.render("search")
    })
    
    
    app.get('/music', function(req, res) {
        // var getmusics=[];
        Music.getTenNew(null, 1, function(err, musicsnew, total) {
            if (err) {
                musicsnew = [];
            }
            Music.getTenHot(null, 1, function(err, musicshot, total) {
                if (err) {
                    musicshot = [];
                }
                res.render("music", {
                    user: req.session.user,
                    musicsnew: musicsnew,
                    musicshot: musicshot,
                    name: req.session.username,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });

            });
        });
    });
    app.get('/newlist', function(req, res) {

        Music.getTenNew(null, 1, function(err, musicsnew, total) {
            if (err) {
                musicsnew = [];
            }
            Music.getTenHot(null, 1, function(err, musicshot, total) {
                if (err) {
                    musicshot = [];
                }
                res.render("newlist", {
                    user: req.session.user,
                    musicsnew: musicsnew,
                    musicshot: musicshot,
                    name: req.session.username,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });

            });
        });
    });
    app.get('/hotlist', function(req, res) {
        res.render("hotlist", {

            user: req.session.user,

            name: req.session.username,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get('/tags', function(req, res) {
        Music.getTags(function(err, tags ) {
            if (err) {
                tags= [];
            }
            // console.log(tag);
            res.render("tag",{
            tag:tags
        })
        })
    });
    app.post('/addlove',checkLogin);
    app.post("/addlove", function(req, res) {

        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()) + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        var love = {
            songname: req.body.songname,
            singername: req.body.singername,
            filename: req.body.filename,
            time: time

        }
      
        var newLove = new Love(req.session.username, love);
        newLove.save(function(err) {
            if (err) {
                res.send(false);
                return;
            }
            User.get(req.session.username, function(err, user) {
                if (!user) {
                    res.send(false);
                    return;
                }
                res.send(user.loves);

            })

        })
    });
    app.post('/dellove',checkLogin);
    app.post("/dellove", function(req, res) {
        Love.remove(req.session.username, req.body.songname, req.body.singername, req.body.filename, function(err, docs) {
            if (err) {
                res.send(false);
                return;
            } else {
                User.get(req.session.username, function(err, user) {
                    if (!user) {
                        res.send(false);
                        return;
                    }

                    res.send(user.loves);

                })
            }

        })
    })
    app.post("/getlrc", function(req, res) {
          fs.stat('./public/music/' + req.body.filename + ".lrc", function (err, stats) {
               if (err) {
                res.send("");
                return;
            }
              if (stats.isFile()) {
                   fs.readFile('./public/music/' + req.body.filename + ".lrc", 'utf8', function(err, data) {
                    //读取文件
                    if (err) {
                        res.send("");
                        return;
                    }
                    Music.browse(req.body.filename, function(s) {
                            if (s) return;
                            else {
                                res.send(data);
                            }
                        })
                        //将文件内容显示


                }); 
              }else  {
               res.send("");
                return;
              } });
     
    });

    app.post("/getformusicpv", function(req, res) {
        Music.getformusicpv(req.body.tag, req.body.page, function(err, docs, total) {
            if (err) {
                res.send(false);
                return;
            }
            var msg = {
                docs: docs,
                isFirstPage: (req.body.page - 1) == 0,
                isLastPage: ((req.body.page - 1) * 10 + docs.length) == total


            }
            
            res.send(msg);
        })
    })
    app.post("/getformusictime", function(req, res) {
        Music.getformusictime(req.body.tag, req.body.page, function(err, docs, total) {
            if (err) {
                res.send(false);
                return;
            }
            var msg = {
                docs: docs,
                isFirstPage: (req.body.page - 1) == 0,
                isLastPage: ((req.body.page - 1) * 10 + docs.length) == total


            }

            res.send(msg);
        })
    })
     app.post("/search",function(req, res){
           Music.search(req.body.keyword,function(err,docs){
            if(err){
                docs=[];
            }else{
                res.send(docs);
            }        })
    });

    app.use(function(req,res){      
      
       res.render("404")
    ;})
};
function checkLogin(req,res,next){
  if(!req.session.user){
    req.flash('error','未登录!');
    res.redirect('/login');
  }
  next();
}
function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录!');
    res.redirect('/');
  }
  next();
}
