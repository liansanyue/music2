var mongodb=require('../models/db');
function Music(user,songname,singername,tag,publish,filename){
	this.user=user;
    this.songname=songname;
    this.singername=singername;
    this.tag=tag;
    this.publish=publish;
    this.filename=filename;
     
}
module.exports=Music;
Music.prototype.save= function (callback) {
    var date=new Date();
    //存储各种时间格式，方便以后扩展
    var time={
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear()+"-"+(date.getMonth()+1),
        date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),
        minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate())+" "+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()),
        second:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate())+" "+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+":"+(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())

    }
    //要存入数据库的文档
    var music={
    	user:this.user,
        songname:this.songname,
        time:time,
        singername:this.singername,
        tag:this.tag,
        publish:this.publish,
        filename:this.filename,
        comments:[],//评论
        pv:0,
        info:this.songname+" "+this.singername+" "+this.tag.toString()


    };
    //打开数据库
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将文档插入posts集合
            collection.insert(music,{
                safe:true
            }, function (err) {
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null);

            });
        });
    });
};
Music.getTenNew=function(name,page,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
          collection.count(query,function(err,total){
              collection.find(query,{
                  skip:(page-1)*10,//跳过指定数量的数据
                  limit:10
              }).sort({time:-1}).toArray(function(err,docs){
                  mongodb.close();
                  if(err){
                      return callback(err);
                  }

                  callback(null,docs,total);
              });
          });


        });
    });
};
Music.getTenHot=function(name,page,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
          collection.count(query,function(err,total){
              collection.find(query,{
                  skip:(page-1)*10,//跳过指定数量的数据
                  limit:10
              }).sort({pv:-1}).toArray(function(err,docs){
                  mongodb.close();
                  if(err){
                      return callback(err);
                  }

                  callback(null,docs,total);
              });
          });


        });
    });
};
Music.browse=function(filename,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
          collection.update({"filename":filename},{ $inc:{pv:1}},function(err){
          mongodb.close();
          if(err){
              return callback(err);
                        }callback(null);
                    });                
               } );
    });
};
Music.getTags=function(callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }

//distinct用来给出给定键的所有不同值
            collection.distinct("tag",function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
               
                callback(null,docs);
            });

        });
    });
};
Music.getTag=function(tag,sort,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }

            var query={};
            if(tag){
                query.tag=tag;
            }
            collection.count(query,function(err,total){
                collection.find(query,{
                    "songname":1,
                    "singername":1,
                    "songname":1
                }).sort({sort:-1}).toArray(function(err,docs){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }

                    callback(null,docs,total);
                });
            });

        });
    });
};
Music.getformusicpv=function(tag,page,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(tag){
                query.tag=tag;
            }
          collection.count(query,function(err,total){
              collection.find(query,{
                  skip:(page-1)*10,//跳过指定数量的数据
                  limit:10
              }).sort({pv:-1}).toArray(function(err,docs){
                  mongodb.close();
                  if(err){
                      return callback(err);
                  }

                  callback(null,docs,total);
              });
          });


        });
    });
};
Music.getformusictime=function(tag,page,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('musics', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(tag){
                query.tag=tag;
            }
          collection.count(query,function(err,total){
              collection.find(query,{
                  skip:(page-1)*10,//跳过指定数量的数据
                  limit:10
              }).sort({time:-1}).toArray(function(err,docs){
                  mongodb.close();
                  if(err){
                      return callback(err);
                  }

                  callback(null,docs,total);
              });
          });


        });
    });
};
Music.search=function(keyword,callback){
  console.log(keyword);
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('musics',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            var pattern=new RegExp(keyword,"i");
            collection.find({"info":pattern},{
                "songname":1,
                "singername":1,
                "filename":1,
                "tag":1
            }).sort({pv:-1}).toArray(function (err,docs) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })
    })
}