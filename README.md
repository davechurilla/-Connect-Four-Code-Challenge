# Connect Four 

> A Vue.js project

When asked to build this app, I decided to use VueJS, and here is the result! I'm following the format of the original README file that outlines the assignment so I can talk through each part one at a time. The game works as expected, switching back and forth between two players until one player wins by lining up four checkers in a row on the game board. This version of the app is played by simply clicking the column where you wish to place a checker, if there is an available space. If the column is already full and you try clicking on it to play, you will see an error and will be asked to try again. The game will eventually result in either a win or a draw and display the appropriate message depending on the final result.

![Connect Four
](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Connect_Four.gif/220px-Connect_Four.gif)

## Build Setup

To run the project locally, it is assumed you have recent versions of Node.js and NPM installed to be able to install and run a local runtime server. Once cloned to your hard drive, cd into the directory of the project with Terminal on your Mac, Command Prompt on PC and run the first two commands to get the project running locally in your browser for review and testing. 


``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report


```

Once you get the project set up, you will want to open the app in your browser at localalhost:8080, but also open the Vue component itself in your favorite editor (Atom, SublimeText, VisualStudio, etc). It can be found here:

```python
-Connect-Four-Code-Challenge
|
+-- src
    |
    +-- components
        |
        +-- ConnectFour.vue
```

The code is VERY thoroughly commented for ease of review and understanding of what is going on with the markup and the Vue methods and data properties. I, of course, will welcome any questions about anything I've done here!

## Expectations

Connect Four app runs as expected, and displays a visual representation of game_state in the browser in a simple HTML/CSS ul list using flexbox positioning and SVG shapes for the checkers to keep things flexible and lightweight. 

## Game State

The connect four state of the game is represented as a two dimensional array.
After every turn, this state is updated. 

This is exactly how I handled game_state. It is set as a data property in the component's data object and updated on each turn with the playTurn method. The current game_state is processed into separate array and are checked on each turn to check for instances of a win for the player's move that was just made. If a win or a draw is not detected by the methods in place to do so, the turn is toggled to the next player and the game continues.

```python
game_state = [
  [None, None, None, None, None, None, None],
  [None, None, None, None, None, None, None],
  [None, None, "y", "r", None, None, None],
  [None, None, "r", "y", None, None, None],
  ["r", "y", "y", "y", "r", "r", "y"],
  ["r", "r", "y", "y", "r", "y", "r"],
]
```

## Who's turn is it?

Write a method which, given a game state, returns which player is
supposed to play next. The return value is a string,
either "y" (for the yellow player) or "r" (for the red player).

I actually used a combination of a method called changeTurn, data properties isRed and isYellow, and Vue's 'updated' lifecycle hook to handle this. When the player takes their turn and the game_state data is updated, the method is called, and each data property is toggled from true to false. The data properties are how the current player's turn is determined and not  necessarily a method. Seemed a little simpler, and it was a good opportumity to take advantage of Vue's cool lifecycle hooks.

```python
>>> get_current_player(game_state)
"y"

instead...

isRed: true, // determines red player's turn
isActive: false, // utility on/off switch
```

## Assert state integrity

Write a method which detects anomalies in a given state. The return
value is a boolean and should return `True` when the state is valid.

I figured that the major anomaly that could occur that needed to be detected is if the player trys to click a column that is already full to add a checker. I added a method to detect this on the event handler for each turn when the column is clicked. I'm not checking the entire game_state, but only the column that the player clicked to run a validation method to add a checker or to return an error and let the player try again. It checks the last iteration of the loop on the column array for an empty value, and if it's not, the column is full, and an error is displayed.


```python
>>> is_state_valid(game_state)
True

instead...

is_state_valid: function (i, length, lastIndex) {...}
True // game on
False // overlay with error displays for 2 seconds
```

## Play

Write a play method which accept a state, a column and a color and return
a new game state.

The column argument should accept a value between 0, and 6 (there is 7 columns
in a connect four game)

Yes, this is essentially how I handled this, but with an event handler on the column when clicked. The index of the column is passed and used in the loop to reference to then add the checker or return an error if already full. My game_state array looks the same, but mine is actually 6 x 7 and not 7 x 6. :) I actually found it easier to work with it this way. See the block of code below, and please check out the component itself to see how this works.

```python
>>> game_state = [
...   [None, None, None, None, None, None, None],
...   [None, None, None, None, None, None, None],
...   [None, None, "y", "r", None, None, None],
...   [None, None, "r", "y", None, None, None],
...   ["r", "y", "y", "y", "r", "r", "y"],
...   ["r", "r", "y", "y", "r", "y", "r"],
... ]
>>> play(game_state, 1, "y")
[
  [None, None, None, None, None, None, None],
  [None, None, None, None, None, None, None],
  [None, None, 'y', 'r', None, None, None],
  [None, 'y', 'r', 'y', None, None, None],
  ['r', 'y', 'y', 'y', 'r', 'r', 'y'],
  ['r', 'r', 'y', 'y', 'r', 'y', 'r']
]

how I did it ...

[
  ["r","y","r","y","r",""],
  ["y","r","y","","",""],
  ["y","r","y","r","y",""],
  ["r","y","r","y","r",""],
  ["r","y","r","y","r","y"],
  ["y","r","y","r","y",""],
  ["r","y","r","y","r",""]
]

// event handler for when player takes a turn and clicks column to add a checker
playTurn: function (event) {
  const targetCol = event.currentTarget.dataset.value
  this.currentPlay.colNum = parseInt(targetCol)
  let targetColArr = this.game_state[targetCol]
  for (){...}
```

## Winner

Create a function which, given a game state, returns true if the game has a winner.

This is in place, has been tested, and works as expected consistently for horizontal, vertical and diagoanl conditions. It is handled by the checkForWinner method by checking for any instances of 4-in-a-row in the current game_state. If a win is not detected, a method is also in place that check to see if the game has resulted in a a draw.

```python
checkForWinner: function () { ...
  if (winner) this.gameIsOver('win'); return winner
}

checkForDraw: function (arr) {
  const gameState = arr
  gameState.map(col => {
    col.map(value => {
      if ((value !== '') && (this.playCount >= 42)) this.gameIsOver('draw')
    })
  })
  this.playCount++
},
```

## Next Move

Create a function which, given a game state and a color, returns a recommendation for the next move to be played (as the column number).**

**This still needs to be done. In the interest of time, I wanted to deliver to you what I have now and revisit this portion of the assignment if possible. I hope you are pleased with what I've already accomplished here at this point. Please be sure to check out the src > components > ConnectFour.file file and dig into the code. As I said, I welcome any questions and look forward to your feedback. 

Thank you!

Dave Churilla
churilla@gmail.com




