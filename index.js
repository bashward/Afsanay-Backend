const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const app=express()

app.use(express.urlencoded({extended:true}))
app.use(cors())

const username=process.env.MONGODB_USERNAME
const password=process.env.MONGODB_PASSWORD 
async function main(){
try {
    await mongoose.connect("mongodb+srv://"+username+":"+password+"@cluster0.ooygbbp.mongodb.net/Afsanay");
  } catch (error) {
    console.log(error);
  }
}
main()


const ShayariSchema=new mongoose.Schema({
    shayari: String,
    likes: Number
})

const Shayari=new mongoose.model('Shayari',ShayariSchema)

app.get('/',(req,res)=>{
   async function getShayaris(){
    try{
        const shayaris=await Shayari.find()
        return shayaris
    }catch(err){
        console.log(err)
    }
   }
   getShayaris().then((shayaris)=>{
    res.send(shayaris)
   })
})

app.post('/create',(req,res)=>{
    const shayari=req.body
    async function createShayari(){
        try{
            const nShayari=await Shayari.create({
                shayari: shayari.text,
                likes: shayari.likes
            })
            console.log('New Entry ',nShayari)
        }catch(err){
            console.log(err)
        }
    }
    createShayari()
})

app.post('/update',(req,res)=>{
    
    const id=req.body.id;
    const inc=req.body.inc
    console.log(inc)
    async function updateLike(){
      try{
        const shayari=await Shayari.findById(id)
        let likeupdate
        if(inc===true){
            likeupdate=shayari.likes+1
        }
        if(inc===false){
            likeupdate=shayari.likes-1
        }
        const update=await Shayari.findByIdAndUpdate(id,{likes: likeupdate})
        return update
      }catch(err){
        console.log(err)
      }
    }
updateLike().then((update)=>{
    res.send(update)
    console.log('Successfully updated',update)
})
})

app.listen(3001 || process.env.PORT,()=>{
    console.log('Server is running')
})