//code and design by Igor Busquets using the awesone p5.js library p5js.org
//
//I need help debugging the block's colision

//globals
var blubot;
var food;
var block;
var introbot;
var gameStatus = 0; // 0 intro, 1 gamestart, 2 gameover
var battery = 1000;
var scoreVal = 0;
var score;
var traveling = 0;

function setup(){
createCanvas(windowWidth,windowHeight);

   score = new Score();
   blubot = new Blubot(windowWidth/15);
   food = new Food();
   block = new Block();
} 

function touchStarted(){
if (gameStatus == 0){
    gameStatus = 1;
    return false;
    };
if (gameStatus == 1){
    block.place();
    return false;
    };
if (gameStatus == 2){
   // gameStatus = 0;
    return false;
    };
return false;
}


function draw(){
   background(40);
   gameInit();
}

//game structure
var start = function(){

    score.renderScore();
    score.lifeMax();
    score.warning();
    food.renderFood();
    food.eat();
    block.renderBlock();
    block.blocking();
    blubot.renderBot();
    blubot.updateBot();
    blubot.edges();
    isGameover();
    battery = battery - 1;
 //   console.log("battery: " + battery);
    
}


var gameInit = function(){
    
    if (gameStatus == 0){
    intro();
    } else if (gameStatus == 1){
        start();
    }else if (gameStatus == 2){
    gameover();
    }    
}

var isGameover = function(){
    if(battery < 10){gameStatus=2;}
}

var gameover = function(){
//console.log("gameover ");
push();
//fill(200);
fill(255, 10, 0);
textSize(blubot.s*2);
textAlign(CENTER); 
textStyle(BOLD);
text("GAME OVER",width /2,  height /2);

//finalscore
fill(0, 100, 200);
textSize(blubot.s - blubot.s /8);
text("SCORE: "+ scoreVal + "    TRAVEL: " + abs(traveling/100) , width /2,  height /2 +height/8);

 //touch txt
    textSize(12); 
    textStyle(NORMAL);
    textFont("Helvetica");
    fill(100, 100, 100);
    text("continue / restart coming soon", width/2,  height - 30 );
pop();
}

//blubot constructor
function Blubot(s){
 this.s = s;
 this.pos = createVector(width/2,height/2);
 this.vel = p5.Vector.random2D();
 this.dir = this.vel.heading();
   
 this.updateBot = function(){
     this.pos.add(this.vel);
     this.dir =                             this.vel.heading();
     this.vel.normalize();
     this.vel.mult(8);
   };
   
this.edges = function(){

//console.log(this.pos.x);
    if(this.pos.x > width- this.s*1.1 || this.pos.x < 0 + this.s*1.1){
   // console.log("OUT")
   this.vel.x *= -1;
    };
    if(this.pos.y > height- this.s*1.1 || this.pos.y < 0 + this.s*1.1){
    // console.log("OUT");
   this.vel.y *= -1;
    }
 };
  
this.renderBot = function() {

  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.dir+PI/2);
   
     //body
       noStroke();
       fill(0, 100, 200);
       rectMode(CENTER);
       rect(this.s- this.s, this.s-this.s, this.s, this.s, this.s/5 );
   
       //head
       noStroke();
       fill(255, 10, 0);
       rectMode(CENTER);
       rect(this.s - this.s, this.s- this.s- this.s/3, this.s ,this.s/3);
pop();

        traveling++;
         }
 
}// end of blubot constructor 

function randPos(){
   return createVector(random(30, width -30),random( 50,height-50));
}

var changeFood = function(){
    setTimeout(function(){food.pos = randPos();}, 1000);
     };

// food constructor 
function Food(){
   this.pos = randPos();
   this.s = 15;
   
  this.eat = function(){
   //console.log(abs(floor(blubot.pos.x) - floor(this.pos.x)));
      if(abs(floor(blubot.pos.x) - floor(this.pos.x)) <= this.s && abs(floor(blubot.pos.y) - floor(this.pos.y)) <= this.s){
   //console.log("come");
   this.pos.x = -1000;
   this.pos.y = -1000;
  changeFood();
  scoreVal++
  battery += 333;
  
      }// end of if
   
   };// end of eat
   
   this.renderFood = function(){
   push();
   translate(this.pos.x, this.pos.y);
   noStroke();
   fill(125, 255, 0);
    rectMode(CENTER);
    rect(this.s-this.s,this.s-this.s, this.s, this.s, this.s/5);
    pop();
    }
    
} // end of food constructor 


// block  constructor 
function Block(){
   this.pos = createVector(-1000, -1000)
   this.s = 30;
     
   this.place = function(){
       this.pos = randPos();
   };
   
   
   this.blocking = function(){
   
   
      if(abs(floor(blubot.pos.x) - floor(this.pos.x)) <= this.s && abs(floor(blubot.pos.y) - floor(this.pos.y)) <= this.s){
      
     // if(blubot.pos.y) ?
      
      //blubot.vel.x *= -1;
   blubot.vel.y *= -1;
    battery +=6;
    
    
  /* //debug
   push();
   translate(this.pos.x, this.pos.y);
   textAlign(CENTER);
   text("debug bot pos: x"+ +abs(floor(this.pos.x- blubot.pos.x))+ "   y" +abs(floor(this.pos.y- blubot.pos.y)), 0, 0 );
   text("debug x>y: "+ abs(floor(this.pos.x- blubot.pos.x))< abs(floor(this.pos.y- blubot.pos.y)) ,0,20 )
   pop();
   // end debug    
   */
    
 // console.log(blubot.vel.x );
   }// end of colision  if
  
   
   };// end of blocking
   
   this.renderBlock = function(){
   push();
   translate(this.pos.x, this.pos.y);
 
   //+ txt
    textAlign(CENTER);
    textSize(this.s-this.s/3); 
    textStyle(NORMAL);
    textFont("Helvetica");
    fill(125, 255, 0);
    text("+", this.s-this.s,this.s-this.s +this.s/4);
    
    //box
   noStroke();
   fill(125, 255, 0,50);
   //fill(125);
    rectMode(CENTER);
    rect(this.s-this.s,this.s-this.s, this.s, this.s, this.s/7);
    
    pop();
    }
    
} // end of block constructor 

//splash intro
var intro = function(){

var introbot = new Blubot( 100);
    introbot.dir = 0 - PI/4;
    introbot.renderBot();
    
    push();
    //logo txt
    textAlign(CENTER);
    textSize(24); 
    textStyle(BOLD);
    textFont("Helvetica");
    fill(0, 100, 200);
    text("blubot", width /2 , height/2 + 100);
    //touch txt
    textSize(12); 
    textStyle(NORMAL);
    textFont("Helvetica");
    fill(100, 100, 100);
    text("touch to play", width/2,  height - 30 );
    pop();
 }
    
function Score(){
   this.s = 20;
   this.pos = createVector(width/10, height-this.s);
    this.renderScore = function(){
     //touch txt
    textSize(14); 
    textStyle(NORMAL);
    textFont("Helvetica");
    fill(100, 100, 100);
    text("BATTERY LIFE: " + (floor(battery /10)-1) +"%" + "    "+"SCORE: "+ scoreVal + "    TRAVEL: " + abs(traveling/100) , this.pos.x,  this.pos.y);
    this.lifeMax= function(){
       if ( battery > 1000){
          battery = 1000; 
           }
    };
    this.warning = function(){
    var a=60;
    var b=0;
       if(battery < 333){
       push();
         
  /*
      if(b<a){
   for(i=0;i<a;i++){
        fill(200, 100, 100, i);
        }
    }else{
       for(i=40;i>a;i--){
        fill(200, 100, 100, i);
        }
    }
    */
    // txt
    textSize(blubot.s*2); 
    textStyle(BOLD);
    textAlign(CENTER);
    textFont("Helvetica");
    fill(255, 10, 0,a);
 text("LOW BATTERY", width /2,  this.pos.y- height /2+ blubot.s);
       };
        pop();
    };
    
    }
}// end of score
