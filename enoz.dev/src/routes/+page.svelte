<script lang="ts">
	import pfp from '$lib/assets/gh-small.png';
	import githubLogo from './assets/github-mark-white.svg';
	import discordLogo from './assets/discord-icon-svgrepo-com.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import Profile from './components/profile.svelte';

	const profiles = [
		{
			text: 'Github',
			icon: githubLogo,
			bgcolor: 'bg-neutral-800/90',
			url: 'https://github.com/Enoz'
		},
		{
			text: 'Discord',
			icon: discordLogo,
			bgcolor: 'bg-[#7289da]',
			url: 'https://discordapp.com/users/206412058516783104'
		}
	];
</script>

<div class="flex h-full flex-col items-center justify-center">
	<div class="grid">
		<img class="clip-circle w-3xs" src={pfp} alt="Github Profile" />
		<h1 class="mt-6 text-center text-3xl">Arek <i class="text-amber-600">Enoz</i> Dudek</h1>
		<Button class="mt-3 text-2xl select-none" href="/chat"
			><span class=" h-[1rem] w-[1rem] animate-pulse rounded-full bg-green-500"></span> Live Chat</Button
		>
	</div>

	<div class="flex pt-[2rem]">
		{#each profiles as profile (profile.text)}
			<span class="pr-[5px] pl-[5px]">
				<Profile
					text={profile.text}
					icon={profile.icon}
					bgcolor={profile.bgcolor}
					url={profile.url}
				/>
			</span>
		{/each}
	</div>
</div>

<style>
	.clip-circle {
		clip-path: circle();
	}
</style>
