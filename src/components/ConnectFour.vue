<template>
  <div class="connect-four">
    <h1>{{ msg }}</h1>
    <div class="gameboard-container">
      <div class="overlay" :class="{'active': isOverlay}"><h2><em>Invalid move!<br />Please try again.</em></h2></div>
      <ul class="gameboard">
        <li v-for="(col, index) in cols" :key="index" class="col">
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
      <!-- conditional rendering with a v-if that will swich between red and yellow player on each turn -->
      <!-- on game ending (gameOver=true, on draw or win) the resulting block is v-if for conditions of either a win or draw. Start Game Over button displays -->    
    <div class="game-status">
      <div v-if="gameOver">
        <h3 v-if="isWin">Game is over. 
          <span v-if="isYellow" :class="{'red': isRed, 'yellow': isYellow }"><strong class="red">RED</strong></span>
          <span v-else :class="{'red': isRed, 'yellow': isYellow }"><strong class="yellow">YELLOW</strong></span>
           is the winner!</h3>
        <h3 v-if="isDraw">Game is over and has ended in a draw.</h3>  
        <p>Please play again by pressing the reset button below.</p>
        <button @click.stop.prevent="startOver()"><strong>Start Game Over</strong></button>
      </div>
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
      game_state: [],
      playCount: 1,
      isGridInit: false,
      isYellow: false, // determine's which player's turn it is
      isRed: true, // determine's which player's turn it is
      isActive: false,
      isOverlay: false,
      currentPlay: {
        color: String,
        rowNum: Number,
        colNum: Number,
        colPlayed: Array,
        rowPlayed: Array,
        rightDiagPlayed: Array,
        leftDiagPlayed: Array,
        consoleMsg: String
      },
      gameOver: false,
      isWin: false,
      isDraw: false,
      nodisplay: true
    }
  },
  mounted: function () {
    let vm = this
    if (!this.gridInit) {
      this.initGrid = this.setGrid()
      this.game_state = this.initGrid
      vm.isGridInit = true
    }
  },
  methods: {
    setGrid: function () {
      const thisGrid = new Array(7).fill('').map(() => new Array(6).fill(''))
      return thisGrid
    },
    indexReverse: function (index, count) {
      return Math.abs(index - count)
    },
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
    is_state_valid: function (i, length, lastIndex) {
      if (i === length && lastIndex === '') return false // last move valid move
      const vm = this
      vm.isOverlay = true
      setTimeout(function () {
        vm.isOverlay = false
        return true
      }, 2000)
    },
    changeTurn: function () {
      this.updateArrays()
      // this.currentPlay.colPlayed = col
      this.isYellow = !this.isYellow
      this.isRed = !this.isRed
      const selector = document.querySelector(this.selector)
      const elColor = this.currentPlay.color
      selector.classList.add('active')
      selector.classList.add(elColor)
    },
    getColArray: function () {
      const gameState = this.game_state
      const colNumPlay = parseInt(this.currentPlay.colNum)
      let colPlayedArr = []
      colPlayedArr = gameState[colNumPlay]
      this.currentPlay.colPlayed = colPlayedArr
    },
    getRowArray: function () {
      const gameState = this.game_state
      const rowNumPlay = parseInt(this.currentPlay.rowNum)
      let rowPlayedArr = []
      gameState.map(item => {
        rowPlayedArr.push(item[rowNumPlay])
      })
      this.currentPlay.rowPlayed = rowPlayedArr
    },
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
    updateArrays: function () {
      this.getColArray()
      this.getRowArray()
      this.getRightDiagArray()
      this.getLeftDiagArray()
    },
    checkForFour: function (array) {
      return array.some(function (a, i, aa) {
        return i > 1 && a === aa[i - 3] && a === aa[i - 2] && a === aa[i - 1] && a !== '' && a !== undefined
      })
    },

    checkForWinner: function () {
      let colWinner = this.checkForFour(this.currentPlay.colPlayed)
      let rowWinner = this.checkForFour(this.currentPlay.rowPlayed)
      let rightDiagWinner = this.checkForFour(this.currentPlay.rightDiagPlayed)
      let leftDiagWinner = this.checkForFour(this.currentPlay.leftDiagPlayed)
      let winner = colWinner || rowWinner || rightDiagWinner || leftDiagWinner
      if (winner) this.gameIsOver('win'); return winner
    },
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
    gameIsOver: function (cond) {
      this.gameOver = true
      this.nodisplay = false
      if (cond === 'win' ) this.isWin = true
      if (cond === 'draw' ) this.isDraw = true  
    },
    updateBoard: function () {
      let elements = document.getElementsByClassName('row')
      elements = Array.from(elements) // convert to array
      elements.map(element =>
        ({
          class: element.classList.remove('active', 'red', 'yellow')
        })
      )
    },
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
  computed: {
    selector: function () {
      return '.column' + this.currentPlay.colNum + ' ' + '.row' + this.currentPlay.rowNum
    }
  },
  watch: {

  },
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
