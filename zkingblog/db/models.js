/**
 * Created by Administrator on 2017/3/7.
 */
var mongoose=require('mongoose');
   //标识用户id
    var ObjectId=mongoose.Schema.Types.ObjectId;
    module.exports={
        User:{
            //设置User的数据模型
            username:{type:String,required:true},//用户名
            password:{type:String,required:true},//密码
            email:{type:String,required:true},//邮箱
            avatar:{type:String,required:true}//头像
        },
        Article:{
            //设置文章的数据模型
            comments: [
                {user:{type:ObjectId,ref:'User'},content:String,createAt:{type: Date, default: Date.now}}
            ],
            pv:{type:Number,default:0},
            user:{type:ObjectId,ref:'User'},//用户
            title:String,//标题
            content:String,//内容
            createAt:{type:Date, default:Date.now}//创建时间

        }
    }

