<script lang="ts">
	import pfp from '$lib/assets/gh-small.png';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="grid h-full items-center justify-center">
	<div class="grid">
		<img class="clip-circle w-3xs" src={pfp} alt="Github Profile" />
		<h1 class="mt-6 text-center text-3xl">Arek <i class="text-amber-600">Enoz</i> Dudek</h1>
		<Button class="mt-3 text-2xl" href="/chat"
			><span class="h-[1rem] w-[1rem] animate-pulse rounded-full bg-green-500"></span> Live Chat</Button
		>
	</div>
</div>

<style>
	.clip-circle {
		clip-path: circle();
	}
</style>
