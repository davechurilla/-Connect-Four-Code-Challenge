<template>
  <div class="connect-four">
    <h1>{{ msg }}</h1>
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
    <caption :class="{'red': isRed, 'yellow': isYellow }"></caption>
    <button @click.stop.prevent="startOver()" :class="{'gameover': gameOver, 'nodisplay': nodisplay}" >Start Game Over</button>
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
      isGridInit: false,
      isYellow: false, // determine's which player's turn it is
      isRed: true, // determine's which player's turn it is
      isActive: false,
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
        if (targetColArr[i] === '') {
          this.currentPlay.rowNum = i
          if (this.isRed) {
            targetColArr[i] = 'r'
            this.currentPlay.color = 'red'
            this.changeTurn()
            console.log(this.game_state)
            return
          } else if (this.isYellow) {
            targetColArr[i] = 'y'
            this.currentPlay.color = 'yellow'
            this.changeTurn()
            console.log(this.game_state)
            return
          } else {
            // invalid move method
          }
        } else {
          // out of moves, column full
        }
      }
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
      console.log(colNumPlay)
      console.log(rowNumPlay)
      let leftDiagArr = []
      gameState[colNumPlay].map(item => {
        while (rowNumPlay < 6 && colNumPlay >= 0) {
          leftDiagArr.push((gameState[colNumPlay][rowNumPlay]))
          rowNumPlay++
          colNumPlay--
        }
      })
      this.currentPlay.leftDiagPlayed = leftDiagArr
      console.log(leftDiagArr)
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
      if (winner) this.gameIsOver(); return winner
    },
    gameIsOver: function () {
      this.gameOver = true
      this.nodisplay = false
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
      this.currentPlay.colPlayed = []
      this.currentPlay.rowPlayed = []
      this.currentPlay.rightDiagPlayed = []
      this.currentPlay.leftDiagPlayed = []
      this.gameOver = false
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
    } else {
      console.log('the action is go')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  user-select: none;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
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
a {
  color: #42b983;
}
.gameboard {
  display: flex;
  justify-content: center;
  width: 100%;
}
button.nodisplay {
  display: none;
}
.gameover {
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
/* Small screens */
@media screen and (max-width: 500px) {
  li.row {
    width: 45px;
    height: 45px;
  }
}
</style>
