<script lang="ts">
    import Paper from '$lib/components/base/paper/paper.svelte';
    import MoveLeftIcon from '$lib/components/foundation/icons/MoveLeftIcon.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        class?: string;
        children: Snippet;
        /** Already-localized link for the back button. */
        backHref: string;
        /** Accessible name for the back button. */
        backLabel: string;
    }

    let { class: className = '', children, backHref, backLabel }: Props = $props();
</script>

<Paper class={className}>
    <a
        class="absolute -top-8 z-30 flex aspect-square w-16 items-center justify-center rounded-full border-2 bg-black p-3 text-white"
        href={backHref}
        aria-label={backLabel}>
        <MoveLeftIcon class="m-auto h-8 w-8" />
    </a>
    {@render children()}
</Paper>
