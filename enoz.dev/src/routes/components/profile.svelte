<script lang="ts">
	const { icon, bgcolor, url, text } = $props();
</script>

<a class="flex rounded-full border-2 border-white p-[7px] select-none {bgcolor}" href={url}>
	<img class="clip-circle mr-[5px] h-[2rem] w-[2rem] text-white" src={icon} alt="Social" />
	<p class="text-[1.5rem] font-bold text-white">{text}</p>
</a>
