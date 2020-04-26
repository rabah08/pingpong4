// Connection au server
var socket=io.connect('https://pingpong4players.herokuapp.com');

let players_serveur=[]
let players=[]
let sessionID;
let i=0
let x;
let MonNom;

socket.on('connect', function() {
    sessionID = socket.id;
    console.log(sessionID)
    
  });

  function validateForm() {
     x = f.nom.value;
    if (x == "") {
      alert("le nom doit être remplie !");
      
    }else{
        
        MonNom=x.toString();
        //alert("MonNom: "+MonNom) 
        socket.emit('login',x)
        
    }
  
  }

  socket.on('logged',function () {
    document.getElementById("login").style.visibility="hidden";
  })

     socket.on('newplayer',function(player){
           /* à revenir si ca marche pas  players_serveur.push(id)
            console.log('new player from server: '+id[0]+' players 2: '+id[1])
          
                players[i].id=id;
                i++; */
                alert('Nouveau player : '+player)
                //document.getElementById("players_list").innerHTML+=' '+player+'   ';
                players[i].id=player;
                //alert(' player de id: '+players[i].id)
                i++;
          console.log('first id: '+players[0].id+'second id'+players[1].id+' ')
        })

            socket.on('discuser',function(player){
                    for (let j = 0; j < players.length; j++ ){
                        if(players[j].id==player){
                                players[j].id='';
                                //players[players.lenght-1-j]=players[j]
                               
                        } 
                        players[j].score=0;
                    }     
                    i--;                  
                    alert('le joueur '+player+' a quitter !')
                    window.close()
            })





//*********************** */
// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "#fff"
}

// User Paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#fff"
}

// COM Paddle
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#fff"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "#fff"
}

//Ajouté par med

players[0] = {
    id: '' ,
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#fff"
  };

  players[1] = {
    id:'',
    x : canvas.width-10, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#fff"
  };

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
//canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    //user.y = evt.clientY - rect.top - user.height/2;
    for(var i=0;i<players.length;i++){
        if(players[i].id==MonNom){
            players[i].y = evt.clientY - rect.top - players[i].height/2;
            socket.emit('move',players[i])
            console.log(sessionID+'id1:'+players[0].id+'id 2: '+players[1].id)
            console.log('MonNom dans getMousePos: '+MonNom)
            
            //alert("le jeu commence")
        }
        
    }
    
    //players[1].y = evt.clientY - rect.top - players[1].height/2;
    
}

//ajouté par med
function movePlayer(){

    canvas.addEventListener("mousemove", getMousePos);
   
    if(players[1].id!=MonNom){
        
        socket.emit('ball',ball)
        
    }
   
}

// when COM or USER scores, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#fff";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
/* function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    // simple AI
    //com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    
    // we check if the paddle hit the user or the com paddle
    // let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    let player = (ball.x + ball.radius < canvas.width/2) ? players[0] : players[1];
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // play sound
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.3;
    }
} */
// Ajouté par med

//fonction update

function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if( ball.x - ball.radius < 0 ){
        players[1].score++;
        //comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        players[0].score++;
        //userScore.play();
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    // simple AI
    //com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        //wall.play();
    }
    
    // we check if the paddle hit the user or the com paddle
    // let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    let player = (ball.x + ball.radius < canvas.width/2) ? players[0] : players[1];
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // play sound
        //hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.3;
    }

   
       
 
}

/* function drawPlayers() {
     //bloc ajouté par med
     socket.on('move-remote', function(playersNew) {
        players=playersNew
     });
         players.forEach(function({ x,y,width,height,color}) {
      drawRect(x, y, width, height, color);
       
    });
      
  } */

  var player_recu;
  var maball;
  function drawPlayers() {
    //bloc ajouté par med
    socket.on('move-remote', function(player) {
      //for (let i = 0; i <= players.length; i++) {
         if (/*players[i].id==player.id &&*/ player.id != MonNom) {
            // players[i]=player;
             player_recu =player;
             
                 
             }

         
         
         
       /*   drawArc(ball.x, ball.y, ball.radius, ball.color);
         if(player[1].id!=''){
             socket.emit('ball',ball)
         } */
         
        //}
         
     //  drawRect(players[i].x, players[i].y, players[i].width, players[i].height, players[i].color);
     
 socket.on('ball-remote',function (ball_recu) {
        if (player.id != MonNom) {
            maball=ball_recu;
        }
         })   

        for (let i = 0; i < players.length; i++) {
                if(players[i].id==player_recu.id){
                    players[i].score=player_recu.score;
                }
        
        }
    });

      

    drawArc(maball.x, maball.y, maball.radius, maball.color);
    drawRect(player_recu.x, player_recu.y, player_recu.width, player_recu.height, player_recu.color);
    
    for(var i=0;i<players.length;i++){
        if(players[i].id==MonNom){
        drawRect(players[i].x, players[i].y, players[i].width, players[i].height, players[i].color);
        //drawArc(ball.x, ball.y, ball.radius, ball.color); 
        }
    }
    
    
  
 }

// render function, the function that does al the drawing
function render(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // draw the user score to the left
    //drawText(user.score,canvas.width/4,canvas.height/5);
    
    // draw the COM score to the right
    //drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    //ajouter par med

    drawText(players[0].score,canvas.width/4,canvas.height/5);
    drawText(players[1].score,3*canvas.width/4,canvas.height/5); 
    // draw the net
    drawNet();
    
    // draw the user's paddle
    //drawRect(user.x, user.y, user.width, user.height, user.color);
    movePlayer()
    drawPlayers() 
    

    // draw the COM's paddle
    //drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw the ball
   /*  drawArc(ball.x, ball.y, ball.radius, ball.color);
    if(player[1].id!=''){
        socket.emit('ball',ball)
    }*/
    /* socket.on('ball-remote',function (ball_recu) {
        maball=ball_recu;
        drawArc(maball.x, maball.y, maball.radius, maball.color);
    })  */
     
}
function game(){

    if(players[1].id != '' && players[0].id != ''){
        
            update();
            render();
        }
}
// number of frames per second
let framePerSecond = 50;



//call the game function 50 times every 1 Sec

let loop = setInterval(game,1000/framePerSecond);




