<script>
	import { page } from '$app/state';
</script>

<div>
	<h1>{page.status}</h1>
	<p>{page.error?.message}</p>
</div>

<style>
	div {
		display: grid;
		place-content: center;
		height: 100%;
	}
	h1 {
		margin: 0;
		font-size: 5em;
		text-align: center;
	}
	p {
		text-align: center;
		font-size: 2em;
	}
</style>
