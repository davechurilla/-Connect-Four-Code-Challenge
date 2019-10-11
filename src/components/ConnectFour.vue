<template>
  <div class="connect-four">
    <h1>{{ msg }}</h1>
    <ul class="gameboard">
      <li v-for="(col, index) in cols" :key="index" class="col" :class="{'active': isActive}">
        <ul class="column" :class="[`column${index}`]" :data-value="[`${index}`]" @click="!gameOver ? { click:playTurn($event) } : {}">
          <li v-for="(row, index) in rows" :key="index" class="row" :class="`row${indexReverse(index, (rows - 1))}`">
            <svg height="100%" width="100%" :class="{'red': isRed, 'yellow': isYellow }">
              <circle cx="50%" cy="50%" r="45%" stroke-width="1" />
            </svg>
          </li>
        </ul>
      </li>
    </ul>
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
      isYellow: false,
      isRed: true,
      isActive: false,
      currentPlay: {
        color: String,
        rowNum: Number,
        colNum: Number,
        consoleMsg: Function
      },
      gameOver: false
    }
  },
  mounted: function () {
    let vm = this
    function setGrid () {
      const thisGrid = new Array(7).fill(0).map(() => new Array(6).fill(0))
      vm.isGridInit = true
      return thisGrid
    }
    if (!this.gridInit) {
      this.initGrid = setGrid()
      this.game_state = this.initGrid
    }
  },
  methods: {
    indexReverse: function (index, count) {
      return Math.abs(index - count)
    },
    playTurn: function (event) {
      // event.currentTarget.classList.toggle('active')
      const targetCol = event.currentTarget.dataset.value
      this.currentPlay.colNum = targetCol
      let targetColArr = this.game_state[targetCol]

      for (var i = 0; i < targetColArr.length; i++) {
        if (targetColArr[i] === 0 || null) {
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
          }
        }
      }
      console.log(this.currentPlay)
    },
    changeTurn: function () {
      this.isYellow = !this.isYellow
      this.isRed = !this.isRed
      const rowEl = '.row' + this.currentPlay.rowNum
      const colEl = '.column' + this.currentPlay.colNum
      const selector = document.querySelector(colEl + ' ' + rowEl)
      const elColor = this.currentPlay.color
      selector.classList.add('active')
      selector.classList.add(elColor)
    }
  },
  computed: {
    //   return this.currentPlay.consoleMsg = function () {
    //     console.log('the action is go')
    // }
  },
  watch: {
    playUpdate: function () {
      return this.currentPlay.consoleMsg = function () {
        console.log('the action is go')
      }
    }
  },
  updated: function () {
    console.log('the action is go')
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
