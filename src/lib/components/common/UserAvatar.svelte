<script lang="ts">
	export let avatarUrl: string;
	export let className: string;

	function getAvatarBg(avatar: string) {
		const num = avatar.split('.')[0];
		switch (num) {
			case '1':
				return 'bg-blue-500';
			case '2':
				return 'bg-yellow-200';
			case '3':
				return 'bg-yellow-200';
			case '4':
				return 'bg-yellow-200';
			case '5':
				return 'bg-neutral-700';
			case '6':
				return 'bg-blue-500';
			case '7':
				return 'bg-yellow-200';
			case '8':
				return 'bg-yellow-200';
			case '9':
				return 'bg-emerald-600';
			case '10':
				return 'bg-yellow-200';
		}
	}
</script>

<picture
	class=" flex items-end {className} justify-center border border-neutral-300 rounded-full overflow-clip {getAvatarBg(
		avatarUrl || '1.svg'
	)}"
>
	<img class="w-11/12 h-11/12" src="/avatars/{avatarUrl || '1.svg'}" alt="avatar" />
</picture>
