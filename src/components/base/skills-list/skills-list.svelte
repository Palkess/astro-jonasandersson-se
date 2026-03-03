<script lang="ts">
    import { getSkillClassColors } from '$lib/utils/getSkillClassColors';
    import { twMerge } from 'tailwind-merge';

    interface Props {
        class?: string;
        skills: string[];
        style?: string;
    }

    let { class: className = '', skills, style }: Props = $props();
</script>

<ul
    class={twMerge('inline-flex flex-wrap gap-2 *:rounded *:px-3 *:py-1 *:font-medium', className)}
    {style}>
    {#each skills as skill}
        <li class={getSkillClassColors(skill)}>{skill}</li>
    {/each}
</ul>
