<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    interface Props {
        class?: string;
        children: Snippet;
    }

    let { class: className = '', children }: Props = $props();
</script>

<h1
    class={twMerge(
        "view-transition-pageTitle relative mb-24 inline-block max-w-full text-wrap break-words after:absolute after:-bottom-9 after:block after:h-4 after:w-3/4 after:rounded after:bg-white after:content-['']",
        className
    )}>
    {@render children()}
</h1>
