<script lang="ts">
	import pfp from './assets/gh-small.png';
</script>

<div id="home">
	<div id="whoami">
		<img src={pfp} alt="Github Profile" />
		<h1>Arek <i>Enoz</i> Dudek</h1>
	</div>
</div>

<style>
	#whoami {
		display: grid;
		place-items: center;
	}
	#home {
		height: 100%;
		width: 100%;
		display: grid;
		place-content: center;
	}
	h1 {
		text-align: center;
	}
	img {
		clip-path: circle();
		width: 12em;
	}
	i {
		color: salmon;
	}
</style>
