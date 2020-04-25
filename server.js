var http=require('http')


httpServer=http.createServer(function(req,res){

    console.log('un utilisateur a afficher une page')
})

httpServer.listen('1337')

// game state (players list)
const players = [];
let idies=[];
const newplayer={}
const user={};
canvsheight=400;
canvswidth=800;
var x=[0,canvswidth-10];
var cmpt=0;
var io= require('socket.io').listen(httpServer)
io.sockets.on('connection',function(socket){
   
    console.log('Connected sockets connected id :'+socket.id);
    
        /* à revenir si ca marche pas  players[cmpt]={
          id:socket.id
        };
        idies.push(socket.id)
        cmpt+=1; */
         var me;
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
       
        console.log('Disconnect: sockets disconnected')
        delete players[socket.id];
    })
})

function update() {
    io.volatile.emit('players list', Object.values(players));
  }
  
