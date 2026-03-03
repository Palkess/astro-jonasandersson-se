<script lang="ts">
    import FlagBritainIcon from '$lib/components/foundation/icons/FlagBritainIcon.svelte';
    import FlagSwedenIcon from '$lib/components/foundation/icons/FlagSwedenIcon.svelte';
    import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';

    let activeLanguage = $state(getLocale());

    interface Props {
        pageUrl: URL;
    }

    let { pageUrl }: Props = $props();
</script>

{#each locales as locale}
    <a
        rel="alternate"
        class="{activeLanguage === locale ? 'border-b-2' : 'mb-0.5'} flex gap-2 rounded pb-2"
        hreflang={locale}
        href={localizeHref(pageUrl.pathname, { locale })}>
        {#if locale === 'sv'}
            <FlagSwedenIcon /> sv
        {:else if locale === 'en'}
            <FlagBritainIcon /> en
        {/if}
    </a>
{/each}
