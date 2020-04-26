var PORT=process.env.PORT || 1337
var express=require('express')
var app= express();
var http=require('http')

var server=http.Server(app)
/* httpServer=http.createServer(function(req,res){
    console.log('un utilisateur a afficher une page')
         res.writeHead(200,{'Content-Type':'text/html'})
        fs.readFile('index.html',function(error,data){
            if(error){
                res.writeHead(404)
                res.write('error : file not found!')
            }else{
                        res.write(data)
                 }
                 res.end() 
        })
}) */
app.use(express.static('client'))

server.listen(PORT, function(){
    console.log(' game server running')
})
//httpServer.listen(PORT)

// game state (players list)
const players = [];
let idies=[];
const newplayer={}
const user={};
canvsheight=400;
canvswidth=800;
var x=[0,canvswidth-10];
var cmpt=0;
var io= require('socket.io')(server)
io.sockets.on('connection',function(socket){
   
    console.log('Connected sockets connected id :'+socket.id);
    
        /* à revenir si ca marche pas  players[cmpt]={
          id:socket.id
        };
        idies.push(socket.id)
        cmpt+=1; */
         var me=false;
        socket.on('login',function(user){
            me=user;
            cmpt++;
            //me.id=user;
            players[me]=me;
            socket.emit('logged')
            io.sockets.emit('newplayer',me)
        })
     
        for(var k in players){
          socket.emit('newplayer',players[k])
         console.log('server : id numero: '+ k+' valeur: '+players[k]);
                }
        
      socket.on('move',function(player) {
       
        io.volatile.emit('move-remote',player)
       
    })
        socket.on('ball',function(ball) {
                io.volatile.emit('ball-remote',ball)
        })   
        
        
  
    socket.on('disconnect',function(data){
       if(!me){
           return false;
       }
        console.log('Disconnect: sockets disconnected')
        delete players[me];
        io.sockets.emit('discuser',me);
    })
})

function update() {
    io.volatile.emit('players list', Object.values(players));
  }
  
