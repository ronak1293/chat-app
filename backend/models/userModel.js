const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userModel=mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  pic:{type:String,default:"https://vectorified.com/images/default-avatar-icon-25.jpg"}
},{
  timestamps:true
});

userModel.methods.matchPassword=async function(enteredpass){
  return await bcrypt.compare(enteredpass,this.password)
}
userModel.pre('save',async function(next){
  if(!this.isModified){
    next();
  }
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)
})
const User=mongoose.model("User",userModel);
module.exports=User