<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	:global(body, html) {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}
	:global(body) {
		/* Background Start */
		--background-primary: #000000;
		--background-secondary: #0a0a0a;

		background-color: var(--background-primary);

		opacity: 0.9;

		background-image:
			linear-gradient(135deg, var(--background-secondary) 25%, transparent 25%),
			linear-gradient(225deg, var(--background-secondary) 25%, transparent 25%),
			linear-gradient(45deg, var(--background-secondary) 25%, transparent 25%),
			linear-gradient(315deg, var(--background-secondary) 25%, var(--background-primary) 25%);

		background-position:
			6px 0,
			6px 0,
			0 0,
			0 0;

		background-size: 6px 6px;

		background-repeat: repeat;
		/* Background End */
	}

	main {
		font-size: 110%;
		color: rgba(255, 255, 255, 0.95);
		height: 100%;
		width: 100%;
	}
</style>
