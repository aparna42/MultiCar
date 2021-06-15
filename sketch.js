//Absolute path - with respect to the root directory
//C:\Users\ajith\virtual-pet\carRacingStage3\images\car1.png

//Relative path - with respect to the current working directory
//images\car1.png

var canvas, backgroundImage;

var gameState = 0;
var playerCount;
var allPlayers;
var distance = 0;
var database;


var form, player, game;

//creates variables to store the cars, ground and car images
var cars, car1, car2, car3, car4;

var ground, car1_img, car2_img, car3_img, car4_img;

function preload(){
  //loads the images
  track = loadImage("../images/track.jpg");
  car1_img = loadImage("../images/car1.png");
  car2_img = loadImage("../images/car2.png");
  car3_img = loadImage("../images/car3.png");
  car4_img = loadImage("../images/car4.png");
  ground = loadImage("../images/ground.png");
}

function setup(){
  //adjusts canvas size to capture the display width and height of the device
  canvas = createCanvas(displayWidth - 20, displayHeight-30);
  //creates a new instance of the firebase database so we can use it for read and write operations
  database = firebase.database();
  //creates a new game object which becomes the starting point of the game
  game = new Game();
  //gets the current game state from the database
  game.getState();
  //starts the game
  game.start();
}


function draw(){
  //if 4 players have logged in, the game state is updated as 1 in the database
  if(playerCount === 4){
    game.update(1);
  }
 //if the value of variable gameState is 1, the game starts by calling the play function
  if(gameState === 1){
    //clears the pixels on the screen - it helped text from being overwritten when the text version of the game was created
    clear();
    game.play();
  }
  //if the value of variable gameState is 2, the game ends by calling the end function
  if(gameState === 2){
    game.end();
  }
}
