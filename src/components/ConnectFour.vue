<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul class="gameboard">
      <li v-for="(col, index) in cols" :key="index" class="col" :class="`${index}`">
        <ul class="column">
          <li v-for="(row, index) in rows" :key="index" class="row" :class="`${indexReverse(index, (rows - 1))}`">
            <svg height="100%" width="100%" @click.stop.prevent="swichColor" :class="{'red': isRed, 'yellow': isYellow }">
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
      isRed: true
    }
  },
  mounted: function () {
    let vm = this
    function setGrid () {
      let thisGrid = [['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']]
      vm.isGridInit = true
      return thisGrid
    }
    if (!this.gridInit) {
      this.initGrid = setGrid()
      this.game_state = this.initGrid
      // console.log(this.game_state)
    }
  },
  methods: {
    indexReverse: function (index, count) {
      return Math.abs(index - count)
    },
    swichColor: function () {
      this.isYellow = !this.isYellow
      this.isRed = !this.isRed
    }
  },
  computed: {

  },
  watch: {

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
li {
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
a {
  color: #42b983;
}
.gameboard {
  display: flex;
  justify-content: center;
  width: 100%;
}
svg.red circle {
  stroke: red;
  fill: red;
}
svg.yellow circle {
  stroke: yellow;
  fill: yellow;
}
/* Small screens */
@media screen and (max-width: 500px) {
  li {
    width: 45px;
    height: 45px;
  } 
}
</style>
