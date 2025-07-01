<script lang="ts">
	const { data } = $props();
	let messages = $state(data.messages);
</script>

{#each messages as message, idx (idx)}
	<p>{JSON.stringify(message)}</p>
{/each}
