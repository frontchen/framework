<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png">
		<p> {{$store.state.age}}</p>
		<p>{{$store.getters.myAge}}</p>
		<p>{{$store.state.name}}</p>
		<p><button @click="addAge">addAge</button></p>
		<p> <button @click="subAge">subAge</button></p>
	</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
	name: 'App',
	components: {
		// HelloWorld
	},

	methods: {
		addAge() {
			this.$store.commit('addAge', 10)
		},
		subAge() {
			this.$store.dispatch('subAge', 10)
		}
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
