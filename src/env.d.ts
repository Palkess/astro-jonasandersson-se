/// <reference types="astro/client" />

interface ImportMetaEnv {
    /**
     * GTM container id, set as a repository *variable* (not a secret — it ends
     * up in the client bundle by design). Absent locally, which is fine: the
     * consent island simply never loads GTM.
     */
    readonly PUBLIC_GTM_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    /** Created by `cookie-consent.svelte`, but only after an explicit accept. */
    dataLayer?: Record<string, unknown>[];
}
