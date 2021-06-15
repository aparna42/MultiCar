class Player {
  constructor() {
    //initializes all the properties of the player 
    this.index = null;
    this.distance = 0;
    this.name = null;
    this.rank = null;
  }

  //gets the player count from the database by accessing the "playerCount" node
  getCount() {
    var playerCountRef = database.ref('playerCount');
    playerCountRef.on("value", (data) => {
      playerCount = data.val();
    })
  }

  //writes the player count back to the database as per the value of the variable "count"
  updateCount(count) {
    database.ref('/').update({
      playerCount: count
    });
  }

  //updates player name and details back in the database
  update() {
    //if these nodes do not exist,  players/player1 upto players/player4 will be created as the players log in 
    //we use the property "index" to update values of the particular player to the database
    var playerIndex = "players/player" + this.index;

    //the set function creates nodes when they are not present and 
    //overwrites the values in the database including child nodes if they are already present 
    database.ref(playerIndex).set({
      name: this.name,
      distance: this.distance
    });
  }

  /* we create a static function to fetch the entire data in the node "players" into the variable "allPlayers"
  - it contains the details of 4 players and their names and distances
  - a static function is denoted with the keyword "static" before its name
  - a static function does not need an object to be called and is called by using the class name
  */

  static getPlayerInfo() {
    var playerInfoRef = database.ref('players');
    //the arrow function can be used as shorthand notation like this
    playerInfoRef.on("value", (data) => {
      //the players' data will be stored in a JSON format as the firebase database itself utilizes this format
      allPlayers = data.val();
    })
  }

  //used to check how many cars have reached the finish line in order to set that value as the rank
  getCarsAtEnd() {
    //accesses "carsAtEnd" node in the database and stores its value in the current player's property rank 
    database.ref('CarsAtEnd').on("value", (data) => {
      this.rank = data.val();
    })
  }

  //updates the current player's rank as the value of the "carsAtEnd" node
  //if the current player's rank is 1, carsAtEnd will be equal to 1 => one car has crossed the finish line
  static updateCarsAtEnd(rank) {
    database.ref('/').update({
      CarsAtEnd: rank
    })
  }
}
