/**
 * Created by Administrator on 2016/4/6.
 */
/**
 * Created by Administrator on 2016/4/4.
 */
var mongodb=require('../models/db');

function Love(user,love){
    this.user=user;
    this.love=love;
     
    
}
module.exports=Love;
Love.prototype.save= function (callback) {
    var user=this.user,
       love=this.love;
    //打开数据库
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将文档插入posts集合
            collection.update({"name":user},{
                $push:{loves:love}
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
Love.remove=function(user,songname,singername,filename,callback){
     mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
             
            collection.update({"name":user},{ "$pull": { 'loves': { "filename": filename,"songname":songname,"singername":singername} }}, function (err) {
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null);

            });
        });
    });
}
/*Love.getAll=function(name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
         
        db.collection('users', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
            //根据query对象查询文章
            collection.find(query,select).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }


                callback(null,docs);
            });

        });
    });
};*/