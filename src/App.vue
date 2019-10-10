<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <ConnectFour/>
  </div>
</template>

<script>
import ConnectFour from './components/ConnectFour'

export default {
  name: 'App',
  components: { ConnectFour }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
