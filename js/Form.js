class Form {

/*
- HTML can be used to structure content on a web page or a form like this
- The body of an HTML page can contain different types of elements:

-> h1, h2, h3: display headings of different sizes
-> input: to collect input from the user.
-> button: to display a button

- This model of an HTML page is called Document object Model (or DOM).
- We used the p5 DOM library to create the form [the link to it is in index.html - line 7]

*/


  constructor() {
    //creates all elements in the form as properties
    this.input = createInput("Name");
    this.button = createButton('Play');
    this.greeting = createElement('h2');
    this.title = createElement('h2');
    this.reset = createButton('Reset');
  }

  //function that is used to hide the form when the game starts
  hide(){
    this.greeting.hide();
    this.button.hide();
    this.input.hide();
    this.title.hide();
  }

  display(){
    //assigning text and position to all the HTML elements we have created
    this.title.html("Car Racing Game");
    //the elements are positioned according to displayWidth and displayHeight so they are more device compatible
    this.title.position(displayWidth/2 - 50, 0);
    this.input.position(displayWidth/2 - 40 , displayHeight/2 - 80);
    this.button.position(displayWidth/2 + 30, displayHeight/2);
    this.reset.position(displayWidth-100,20);

    /* we use an arrow function here "()=>"
    - arrow functions are a shorthand way of writing javascript functions 
    - also, with a regular function, the "this" keyword in the mousePressed function would refer to the button that the click was performed on
    - we used the arrow function to bind the "this" keyword back to the original object that called the function display - the form object */
    this.button.mousePressed(()=>{

      //hide the textbox and button on clicking the button
      this.input.hide();
      this.button.hide();
      
      //the player's name entered in the textbox is assigned as the property name  of the player object
      player.name = this.input.value();
      //now that a player has logged in, the player count is increased
      playerCount+=1;
      //the current player's index/position is assigned as playerCount [e.g - player1's index will be 1]
      player.index = playerCount;
      //we update the player's details into the database
      player.update();
      //the player count is updated in the database
      player.updateCount(playerCount);
      //adds text to greeting and positions it
      this.greeting.html("Hello " + player.name)
      this.greeting.position(displayWidth/2 - 70, displayHeight/4);
    });

    //when the reset button is pressed, we update playerCount and gameState as 0 in the database to restart the game
    this.reset.mousePressed(()=>{
      player.updateCount(0);
      game.update(0);
    });

  }
}
