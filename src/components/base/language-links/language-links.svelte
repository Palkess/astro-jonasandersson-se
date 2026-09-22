<script lang="ts">
    import FlagBritainIcon from '$lib/components/foundation/icons/FlagBritainIcon.svelte';
    import FlagSwedenIcon from '$lib/components/foundation/icons/FlagSwedenIcon.svelte';

    interface Language {
        code: string;
        /** Link to the current page in this language. */
        href: string;
        current: boolean;
    }

    interface Props {
        languages: Language[];
    }

    let { languages }: Props = $props();
</script>

{#each languages as language}
    <a
        rel="alternate"
        class="{language.current ? 'border-b-2' : 'mb-0.5'} flex gap-2 rounded pb-2"
        hreflang={language.code}
        href={language.href}>
        {#if language.code === 'sv'}
            <FlagSwedenIcon /> sv
        {:else if language.code === 'en'}
            <FlagBritainIcon /> en
        {/if}
    </a>
{/each}
