import type { Snippet } from 'svelte';

export type ButtonTheme = 'primary' | 'secondary';

export type ButtonSize = 'md' | 'lg';

interface CommonButtonProps {
    class?: string;
    theme?: ButtonTheme;
    size?: ButtonSize;
    children: Snippet;
    rest?: {
        [key: string]: any;
    };
}

export interface ButtonProps extends CommonButtonProps {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    element?: HTMLButtonElement;
    onclick?: (e: Event) => void;
}

export interface ButtonLinkProps extends CommonButtonProps {
    type: 'link';
    href: string;
    element?: HTMLAnchorElement;
    download?: string;
    target?: string;
}
