// number guessing game

const express = require('express')
const cookieParser = require('cookie-parser')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use('/',cors({ credentials: true,  exposedHeaders: ["set-cookie"], }));
app.use(cookieParser())
app.use(express.json())

let username = ''
let points = 0

app.get('/',(request,response) => {
  response.send('Number Guessing Game')
})

app.get('/getcookies', (request,response) => {
  // return request.cookies
  response.send(request.cookies)
})

app.post('/setcookie', (request,response) => {
  let user = request.body
  response.cookie('user',{username:user.username,points:user.points})
  response.send('cookies have been set')
})

app.listen(8000)

const startGame = async () => {
  try{
     let cookie =await axios.get('http://localhost:8000/getcookies')
    if(cookie.username==null){
      while(true){
        console.log('Enter your username ')
        username = prompt('')
        if(username.length==0){
          console.log('Username CAN NOT be empty\n')
        }else if(username.length<4){
          console.log('username MUST contain at least 4 characters\n')
        }else{
           let response = await axios.post('http://localhost:8000/setcookie', {
             username:username,
             points:points
           },{
             withCredentials:true
           })
          break
        }
      } 
    }else{
      username = cookie.username
      console.log('username: '+username)
      points = cookie.points
    } 
while(true){
  let level = points + 1
  console.log('Player : ' + username + '\nPoints: ' + points + '\nLeveL: ' + level + '\n')
  console.log('Enter 0 to Quit the game\n')
  console.log('Guess a number between 1 and ' + (level+1))
  let guess = 0
  while(true){
    guess = prompt('')
    if(isNaN(guess)){
      console.log('please enter a Number')
    }else if(guess<1 || guess>level+1){
      console.log('please enter a number in the given range')
    }else{
      break
    }
  }
  let number = (Math.ceil(Math.random()*(level+1)))
  if(guess==number){
    console.log('Congratulations, Level ' + level + ' complete\nLevel: ' + (level+1) + '\n')
    points += 1
    level += 1
    axios.post('http://localhost:8000/setcookie', {
      username:username,
      points:points
    },{
       withCredentials:true
     })
  }else if(guess==0){
    console.log('Game Ended!!')
    break
  }else{
    console.log('Ooooh, you lost\n')
  }
}  
  }catch(error){
    console.log(error)
  }
}

startGame()
