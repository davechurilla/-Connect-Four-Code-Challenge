<template>
  <div class="connect-four">
    <h1>{{ msg }}</h1>
    <!-- Visual representation of of game_state -->
    <div class="gameboard-container">
      <div class="overlay" :class="{'active': isOverlay}"><h2><em>Invalid move!<br />Please try again.</em></h2></div>
      <ul class="gameboard">
        <li v-for="(col, index) in cols" :key="index" class="col">
          <!-- columns with event handler playTurn which places the checker for each turn -->
          <ul class="column" :class="[`column${index}`]" :data-value="[`${index}`]" @click="!gameOver ? { click:playTurn($event) } : {}">
            <li v-for="(row, index) in rows" :key="index" class="row" :class="`row${indexReverse(index, (rows - 1))}`">
              <svg height="100%" width="100%">
                <circle cx="50%" cy="50%" r="45%" stroke-width="1" />
              </svg>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- this entire block is a conditional v-if switching between gameplay and game ending, dependent on gameOver boolean -->
    <div class="game-status">
      <!-- conditions of either a win or draw will set isWin or isDraw data to true and display expected message --> 
      <div v-if="gameOver">
        <!-- win messaging -->
        <h3 v-if="isWin">Game is over. 
          <span v-if="isYellow" :class="{'red': isRed, 'yellow': isYellow }"><strong class="red">RED</strong></span>
          <span v-else :class="{'red': isRed, 'yellow': isYellow }"><strong class="yellow">YELLOW</strong></span>
           is the winner!</h3>
        <!-- messaging for when game is a draw -->
        <h3 v-if="isDraw">Game is over and has ended in a draw.</h3>  
        <p>Please play again by pressing the reset button below.</p>
        <!-- Start Over button -->
        <button @click.stop.prevent="startOver()"><strong>Start Game Over</strong></button>
      </div>
      <!-- at beginning of game and during gameplay, conditional rendering with a v-if that will switch between red and yellow player on each turn -->
      <h3 v-else>Game is in session. It is the 
        <span v-if="isRed" :class="{'red': isRed, 'yellow': isYellow }">RED</span>
        <span v-else :class="{'red': isRed, 'yellow': isYellow }">YELLOW</span>
        player's turn.<br />Please click a column above to drop a checker. 
      </h3> 
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectFour',
  data () {
    return {
      msg: 'Welcome to Connect Four!',
      cols: 7,
      rows: 6,
      game_state: [], // main data array of the game board, updated on each turn 
      playCount: 1, // counts up the number of plays in a game. used to determine a draw
      isGridInit: false, // used to confirm initial array creat of game_state
      isYellow: false, // determine's which player's turn it is
      isRed: true, // determine's which player's turn it is
      isActive: false, // utility on/off switch
      isOverlay: false, // for invalid move when player tries to click full column
      currentPlay: { // data used on each trun
        color: String, // checker color 
        rowNum: Number, // row position of checker
        colNum: Number, // column position of checker
        colPlayed: Array, // enter column array based on colNum
        rowPlayed: Array, // enter row array based on colRow
        rightDiagPlayed: Array, // enter column array based on colNum & rowNum
        leftDiagPlayed: Array, // enter column array based on colNum & rowNum
        consoleMsg: String // utility
      },
      gameOver: false, // set to true free game play when either win or draw is detected
      isWin: false, // set when conditions for a win are detected
      isDraw: false, // set when conditions for a draw are detected
      nodisplay: true // utility
    }
  },
  // inital 2D array is using setGrid method into inherited initGrid prop
  // game_state data is then set from this initialized prop
  mounted: function () {
    let vm = this
    if (!this.gridInit) {
      this.initGrid = this.setGrid()
      this.game_state = this.initGrid
      vm.isGridInit = true
    }
  },
  methods: {
    // empty array created at the beginning of the game
    setGrid: function () {
      const thisGrid = new Array(7).fill('').map(() => new Array(6).fill(''))
      return thisGrid
    },
    // utility method used to reverse index order of column/row <li> tags
    indexReverse: function (index, count) {
      return Math.abs(index - count)
    },
    // event handler for when player takes a turn and clicks column to add a checker
    playTurn: function (event) {
      const targetCol = event.currentTarget.dataset.value
      this.currentPlay.colNum = parseInt(targetCol)
      let targetColArr = this.game_state[targetCol]
      for (var i = 0; i < targetColArr.length; i++) {
        if (!(i + 1 < targetColArr.length)) {
          this.is_state_valid(i + 1, targetColArr.length, targetColArr[5])
        }
        if (targetColArr[i] === '') {
          this.currentPlay.rowNum = i
          if (this.isRed) {
            targetColArr[i] = 'r'
            this.currentPlay.color = 'red'
            if (!this.gameOver) { this.changeTurn() }
            console.log(this.game_state)
            return
          } else if (this.isYellow) {
            targetColArr[i] = 'y'
            this.currentPlay.color = 'yellow'
            if (!this.gameOver) { this.changeTurn() }
            console.log(this.game_state)
            return
          }
        }
      }
    },
    // check for open space in column to add checker
    // error displays on invalid move
    is_state_valid: function (i, length, lastIndex) {
      if (i === length && lastIndex === '') return false // last move valid move
      const vm = this
      vm.isOverlay = true
      setTimeout(function () {
        vm.isOverlay = false
        return true
      }, 2000)
    },
    // update is detected, and the isRed/isYellow toggle data item fires to switch turns
    // checker displays on the board in the correct position
    changeTurn: function () {
      this.updateArrays()
      this.isYellow = !this.isYellow
      this.isRed = !this.isRed
      const selector = document.querySelector(this.selector)
      const elColor = this.currentPlay.color
      selector.classList.add('active')
      selector.classList.add(elColor)
    },
    // column array based on checker position to check for win when turn is played
    getColArray: function () {
      const gameState = this.game_state
      const colNumPlay = parseInt(this.currentPlay.colNum)
      let colPlayedArr = []
      colPlayedArr = gameState[colNumPlay]
      this.currentPlay.colPlayed = colPlayedArr
    },
    // row array based on checker position to check for win when turn is played
    getRowArray: function () {
      const gameState = this.game_state
      const rowNumPlay = parseInt(this.currentPlay.rowNum)
      let rowPlayedArr = []
      gameState.map(item => {
        rowPlayedArr.push(item[rowNumPlay])
      })
      this.currentPlay.rowPlayed = rowPlayedArr
    },
    // forward diagonal array based on checker position to check for win when turn is played
    getRightDiagArray: function () {
      const gameState = this.game_state
      let rowNumPlay = parseInt(this.currentPlay.rowNum)
      let colNumPlay = parseInt(this.currentPlay.colNum)
      if (rowNumPlay > colNumPlay) {
        rowNumPlay -= colNumPlay
        colNumPlay -= colNumPlay
      } else {
        colNumPlay -= rowNumPlay
        rowNumPlay -= rowNumPlay
      }
      let rightDiagArr = []
      gameState[colNumPlay].map(item => {
        while (rowNumPlay < 6 && colNumPlay < 7) {
          rightDiagArr.push((gameState[colNumPlay][rowNumPlay]))
          rowNumPlay++
          colNumPlay++
        }
      })
      this.currentPlay.rightDiagPlayed = rightDiagArr
    },
    // backward diagonal array based on checker position to check for win when turn is played
    getLeftDiagArray: function () {
      const gameState = this.game_state
      let rowNumPlay = parseInt(this.currentPlay.rowNum)
      let colNumPlay = parseInt(this.currentPlay.colNum)
      colNumPlay += rowNumPlay
      rowNumPlay -= rowNumPlay
      if (colNumPlay > 6) {
        const remainder = colNumPlay - 6
        colNumPlay -= remainder
        rowNumPlay += remainder
      }
      let leftDiagArr = []
      gameState[colNumPlay].map(item => {
        while (rowNumPlay < 6 && colNumPlay >= 0) {
          leftDiagArr.push((gameState[colNumPlay][rowNumPlay]))
          rowNumPlay++
          colNumPlay--
        }
      })
      this.currentPlay.leftDiagPlayed = leftDiagArr
    },
    // runs all of the previous four methods on each turn to generate data arrays from the position coordinate(s) of the checker
    updateArrays: function () {
      this.getColArray()
      this.getRowArray()
      this.getRightDiagArray()
      this.getLeftDiagArray()
    },
    // utility method used used to check for win if there are instances of four data items in a row
    checkForFour: function (array) {
      return array.some(function (a, i, aa) {
        return i > 1 && a === aa[i - 3] && a === aa[i - 2] && a === aa[i - 1] && a !== '' && a !== undefined
      })
    },
    // if an instance of four in a row is found on current turn, winner returns true and the game is over
    checkForWinner: function () {
      let colWinner = this.checkForFour(this.currentPlay.colPlayed)
      let rowWinner = this.checkForFour(this.currentPlay.rowPlayed)
      let rightDiagWinner = this.checkForFour(this.currentPlay.rightDiagPlayed)
      let leftDiagWinner = this.checkForFour(this.currentPlay.leftDiagPlayed)
      let winner = colWinner || rowWinner || rightDiagWinner || leftDiagWinner
      if (winner) this.gameIsOver('win'); return winner
    },
    // if a winner is not returned true, this method will check to see if the game has resulted in a draw when data is updated
    checkForDraw: function (arr) {
      console.log('checking for a draw')
      const gameState = arr
      const draw = gameState.map(col => {
        col.map(value => {
          if ((value !== '') && (this.playCount >= 42)) this.gameIsOver('draw');
        })
      })
      this.playCount++
      console.log(this.playCount)
    },
    // triggered of win or draw with unique messaging for each depending on win or draw
    gameIsOver: function (cond) {
      this.gameOver = true
      this.nodisplay = false
      if (cond === 'win' ) this.isWin = true
      if (cond === 'draw' ) this.isDraw = true  
    },
    // removes class names in the DOM for the checkers so the boeard is cleared when Start Game Over is pressed
    updateBoard: function () {
      let elements = document.getElementsByClassName('row')
      elements = Array.from(elements) // convert to array
      elements.map(element =>
        ({
          class: element.classList.remove('active', 'red', 'yellow')
        })
      )
    },
    // event handler for Start Game Over button
    // clears and resets all data and calls updateBoard to clear checkers
    startOver: function () {
      this.initGrid = this.setGrid()
      this.game_state = this.initGrid
      this.playCount = 0
      this.currentPlay.colPlayed = []
      this.currentPlay.rowPlayed = []
      this.currentPlay.rightDiagPlayed = []
      this.currentPlay.leftDiagPlayed = []
      this.gameOver = false
      this.isWin = false
      this.isDraw = false
      this.nodisplay = true
      this.updateBoard()
      this.isRed = true
      this.isYellow = false
    }
  },
  // builds current selector for use in checker position when adding class names with event handlers
  computed: {
    selector: function () {
      return '.column' + this.currentPlay.colNum + ' ' + '.row' + this.currentPlay.rowNum
    }
  },
  watch: {
    // utility
  },
  // triggered when page is updated
  // does a call to check for a win or a draw on each turn
  updated: function () {
    if (this.checkForWinner()) {
      console.log('Game over = ' + this.gameOver)
    } else if(this.checkForDraw(this.game_state)) {
      console.log('The game is a draw... ' + this.gameOver)
    } else {
      console.log('the action is go')     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: 600;
  user-select: none;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
}
h3, p {
  margin: 0.25em;
}
ul {
  list-style-type: none;
  padding: 0;
}
li.row {
  margin: 0;
  width: 80px;
  height: 80px;
  background: #0099ff;
}
li.row {
  border: 1px solid blue;
}
li.row {
  border-left: 2px solid blue;
  border-right: 2px solid blue;
}
li.row:first-child {
  border-top: 2px solid blue;
}
li.row:last-child {
  border-bottom: 2px solid blue;
}
.column.active li.row {
  background: #fff;
}
button {
  color: blue;
  cursor: pointer;
  border: 1px solid blue;
  padding: 10px;
  margin: 2px;
}
button:hover {
  color: #fff;
  background: blue;
}
.gameboard-container {
  position: relative;
}
.gameboard {
  display: flex;
  justify-content: center;
  width: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease;
  background: rgba(255, 255, 255, 0.5);
}
.overlay.active {
  visibility: visible;
  opacity: 1;
}
.overlay h2 {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -75%);
  font-weight: bold;
  font-size: 2.0rem;
}
button.nodisplay {
  display: none;
}
button.gameover {
  display: inline;
}
li svg {
  display: none;
}
li.active svg {
  display: inline;
}
li.active.red svg circle {
  stroke: red;
  fill: red;
}
li.active.yellow svg circle {
  stroke: yellow;
  fill: yellow;
}
.game-status {
  background: #bbbbbb;
  padding: 10px 0;
}
.game-status .red {
  color: red;
}
.game-status .yellow {
  color: yellow;
}
/* Small screens */
@media screen and (max-width: 500px) {
  h1 {
    font-size: 1.5rem;
  }
  h3, p {
    margin: 0.25em;
    font-size: 1rem;
  }  
  li.row {
    width: 45px;
    height: 45px;
  }
  .overlay h2 {
    font-size: 1.5rem;
  }
}
</style>
