var mongodb=require('../models/db');

var mongo = require('mongodb');

function User(user){
    this.name=user.name;
    this.password=user.password;
    this.email=user.email;

    this.plaintextpw=user.plaintextpw

}
module.exports=User;
//存储用户信息
User.prototype.save=function(callback){
    //要存入数据库的用户文档
    var user={
        name:this.name,
        password:this.password,
        email:this.email,

        plaintextpw:this.plaintextpw,

        loves:[]
    };

    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取user集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //将用户数据插入users集合

            collection.insert(user,{safe:true},function(err,user1){

                mongodb.close();
                if(err){
                    return callback(err);//错误，返回err信息
                }
                //console.log(user);
                callback(null,user);//成功，err为null，并返回存储后的用户文档
               // callback(null,user[0]);//成功，err为null，并返回存储后的用户文档

            });
        });
    });
};
User.get= function (name,callback) {
//打开数据库
console.log(name);
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                return callback(err);//错误，返回err信息
            }
            //查找用户名（name键）值为name一个文档
            collection.findOne({
                name:name
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);//失败，返回err信息
                }
                callback(null,user);//成功，返回查询的用户信息
            });
        });
    });
};
User.getIpUser= function (ip,callback) {
//打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                return callback(err);//错误，返回err信息
            }
            //查找用户名（name键）值为name一个文档
            collection.find({
                ip:ip
            }).toArray(function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }


                callback(null,user);
            });
        });
    });
};
User.getAll=function(name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('users', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
             
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }


                callback(null,docs);
            });

        });
    });

};
User.getAllUsers=function(callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取posts集合
        db.collection('users', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
           
            collection.find().sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }


                callback(null,docs);
            });

        });
    });
};
 User.userupdate=function(id,name,password,plaintextpw,email,callback){

  mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
      
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
 
          var o_id = new mongo.ObjectID(id);
            collection.update({"_id":o_id},{
                $set:{name:name,password:password,plaintextpw,email:email}
            }, function (err) {
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null);

            });
        });
    });
 }
  User.deluser=function(id,callback){
 mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
      
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
 
          var o_id = new mongo.ObjectID(id);
          console.log(o_id);
            collection.remove({"_id":o_id},{
               w:1
            }, function (err) {
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null);

            });
        });
    });


  }
