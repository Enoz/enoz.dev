<script lang="ts">
	import pfp from './assets/gh-small.png';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="grid h-screen items-center justify-center">
	<div class="grid">
		<img class="clip-circle w-3xs" src={pfp} alt="Github Profile" />
		<h1 class="mt-6 text-center text-3xl">Arek <i class="text-amber-600">Enoz</i> Dudek</h1>
		<Button class="mt-3 text-2xl" data-sveltekit-preload-data="tap" href="/chat">Chat</Button>
	</div>
</div>

<style>
	.clip-circle {
		clip-path: circle();
	}
</style>
