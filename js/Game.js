class Game {
  constructor() {

  }

  //this function gets the game state from the database
  getState() {

    //creates a reference to the node "gameState" in the database
    var gameStateRef = database.ref('gameState');

    /*the following code creates a listener function that "listens" to any changes in the "gameState" node
    - function(data) will be executed automatically when the "gameState" node changes and the code inside its curly brackets will be executed */
    gameStateRef.on("value", function (data) {
      // if a change in the node's value occurs, the changed data will be accessed and stored in the "gameState" variable
      gameState = data.val();
    })

  }

  //this function writes the value of "state" as the new value of the "gameState" node in the database
  update(state) {

    //here, "/" refers to the main database inside which the "gameState" node is created
    database.ref('/').update({
    //we access the gameState node in the database and write the value contained in "state" to it
      gameState: state
    });
  }

  /*- opening the form and quickly pressing the play button will throw an error 
   because the database query to get playerCount hasn't been completed yet

   - playerCount should be fetched in the background first before we display the form

   - To prevent this bug, we can set up a .once() asynchronous listener which 
  will get the playerCount data only once and then execute getCount() 
  to set up a permanent listener

  - The asynchronous function will wait for the playerCount value and only
  then the form will be created and displayed
   */

  //creates an asynchronous function named start
  async start() {
    //if the value of the variable "gameState" is 0, we create a new player object
    if (gameState === 0) {
      player = new Player();
      //the ".once" listeners listens to value changes on the "playerCount" node only once 
      var playerCountRef = await database.ref('playerCount').once("value");
      //if the reference to the "playerCount" node exists, we fetch its value
      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        //here we set up the permanent listener inside the getCount function [using .on()]
        player.getCount();
      }
      //create a new form object and display the form
      form = new Form()
      form.display();
    }


    //creates car sprites and adds images to them 
    car1 = createSprite(100, 200);
    car1.addImage("car1", car1_img);
    car2 = createSprite(300, 200);
    car2.addImage("car2", car2_img);
    car3 = createSprite(500, 200);
    car3.addImage("car3", car3_img);
    car4 = createSprite(700, 200);
    car4.addImage("car4", car4_img);

    //adds all car sprites to an array
    cars = [car1, car2, car3, car4];
  }

  //this function is called when the game state becomes 1 
  play() {
    //hides the form
    form.hide();

    //gets all the player details into the variable "allPlayers"
    Player.getPlayerInfo();
    //gets the number of cars that have cross the finish line
    player.getCarsAtEnd();

    //only if the "allPlayers" variable has some value inside will we proceed with the rest of the steps
    if (allPlayers !== undefined) {

      //we display either a brown color for the ground or a ground image
      background(rgb(198, 135, 103));
      //displays the track
      image(track, 0, -displayHeight * 4, displayWidth, displayHeight * 5);


      //used to access the index of the array
      var index = 0;

      //sets the x and y position of the cars
      var x = 175;
      var y;

      //we loop through each player object "plr" present in the "allPlayers" variable
      for (var plr in allPlayers) {

        //add 1 to the index for every iteration of the loop
        index = index + 1;

        //position the cars a little away from each other in x direction
        x = x + 200;

        //use the distance data from the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;

        //apply the x and y values to the corresponding car sprite in the cars array using index - 1
        cars[index - 1].x = x;
        cars[index - 1].y = y;

        //we identify the current player by checking if the index is the same as the player.index
        if (index === player.index) {
          stroke(10);
          fill("red");
          //the current player will be highlighted with a red circle
          ellipse(x, y, 60, 60);
          cars[index - 1].shapeColor = "red";

          //the game camera's x position is centered to be half of the displayWidth
          camera.position.x = displayWidth / 2;
          //its y position follows the y position of the currently active car
          camera.position.y = cars[index - 1].y;
        }
      }

    }

    //if the up arrow key is pressed and player.index contains a value,
    //we increase player.distance by 10 for each keypress and update the distance to the database
    if (keyIsDown(UP_ARROW) && player.index !== null) {
      player.distance += 10
      player.update();
    }

    //if the player goes past the point 3860 [can vary a little based on systems]
    //it means they have crossed the finish line
    if (player.distance > 3860) {
      //the game state changes to 2
      gameState = 2;
      //the player's rank is increased and updated to the database node "carsAtEnd"
      player.rank += 1
      Player.updateCarsAtEnd(player.rank)
    }
    //the car sprites are drawn
    drawSprites();
  }

  //when the game state is 2, the game ends and details are printed on the screen/console
  end() {
    console.log("Game Ended");
    console.log(player.rank);
  }
}
