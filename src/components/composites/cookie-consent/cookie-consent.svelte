<script lang="ts">
    /**
     * Cookie consent — the site's only `client:` island (ADR-008), and the only
     * thing on the site that may load Google Tag Manager.
     *
     * GTM is injected **only** after an explicit accept. Declining, or ignoring
     * the banner, means no GTM script, no analytics cookie and no request to
     * Google at all — the site sets nothing but this one preference key itself.
     * Keep it that way; `docs/agent/context.md` treats it as a business rule,
     * and the privacy policy states it as fact.
     */
    import { onMount } from 'svelte';
    import Button from '$lib/components/base/button/button.svelte';

    interface Props {
        heading: string;
        body: string;
        accept: string;
        decline: string;
        readMore: string;
        /** Already-localized link to the privacy policy. */
        privacyHref: string;
    }

    const { heading, body, accept, decline, readMore, privacyHref }: Props = $props();

    const STORAGE_KEY = 'analytics-consent';
    const gtmId = import.meta.env.PUBLIC_GTM_ID;

    let visible = $state(false);

    function loadGtm() {
        if (!gtmId || document.getElementById('gtm-script')) return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

        const script = document.createElement('script');
        script.id = 'gtm-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        document.head.appendChild(script);
    }

    function choose(consent: 'granted' | 'denied') {
        try {
            localStorage.setItem(STORAGE_KEY, consent);
        } catch {
            /* Private mode, storage disabled — the choice just isn't remembered. */
        }
        visible = false;
        if (consent === 'granted') loadGtm();
    }

    onMount(() => {
        let stored: string | null = null;
        try {
            stored = localStorage.getItem(STORAGE_KEY);
        } catch {
            /* See above. */
        }

        if (stored === 'granted') loadGtm();
        else if (stored !== 'denied') visible = true;
    });
</script>

{#if visible}
    <div
        class="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
        role="dialog"
        aria-modal="false"
        aria-label={heading}>
        <div
            class="bg-navy-100 container mx-auto flex flex-col gap-4 rounded-2xl border-2 p-4 text-white shadow-lg sm:flex-row sm:items-center">
            <p class="flex-1">
                {body}
                <a class="link" href={privacyHref}>{readMore}</a>
            </p>
            <div class="flex flex-col gap-2 sm:flex-row">
                <Button theme="secondary" size="md" onclick={() => choose('granted')}>
                    {accept}
                </Button>
                <Button theme="primary" size="md" onclick={() => choose('denied')}>
                    {decline}
                </Button>
            </div>
        </div>
    </div>
{/if}
