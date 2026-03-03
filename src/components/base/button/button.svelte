<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import type { ButtonLinkProps, ButtonProps } from './types';

    let { element = $bindable(), ...props }: ButtonProps | ButtonLinkProps = $props();

    // Classes are evaluated when the component is rendered, no reactivity.
    let buttonClasses: string[] = [
        'inline-flex items-center justify-center gap-2 font-medium rounded-2xl'
    ];

    switch (props.theme) {
        case 'primary':
        default:
            buttonClasses.push('bg-black text-white hover:bg-white hover:text-black border-2');
            break;
        case 'secondary':
            buttonClasses.push('border-2 bg-white text-black hover:bg-black hover:text-white');
            break;
    }

    switch (props.size) {
        case 'md':
            buttonClasses.push('px-4 py-2 text-base');
            break;
        case 'lg':
            buttonClasses.push('px-5 py-3 text-lg');
            break;
    }
</script>

{#if props.type === 'link'}
    <a
        bind:this={element}
        href={props.href}
        class={twMerge(buttonClasses.join(' '), props.class)}
        download={props.download}
        target={props.target}
        {...props.rest}>
        {@render props.children()}
    </a>
{:else}
    <button
        bind:this={element}
        class={twMerge(buttonClasses.join(' '), props.class)}
        type={props.type ?? 'button'}
        disabled={props.disabled}
        onclick={props.onclick}
        {...props.rest}>
        {@render props.children()}
    </button>
{/if}
