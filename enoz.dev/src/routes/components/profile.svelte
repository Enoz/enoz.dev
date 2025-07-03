<script lang="ts">
	const { icon, bgcolor, url } = $props();
</script>

<a class="flex rounded-full border-2 border-white p-[7px] {bgcolor}" href={url}>
	<img class="clip-circle mr-[5px] h-[2rem] w-[2rem]" src={icon} alt="Social" />
	<p class="text-[1.5rem] font-bold">Github</p>
</a>

<style>
	.clip-circle {
		clip-path: circle();
	}
</style>
