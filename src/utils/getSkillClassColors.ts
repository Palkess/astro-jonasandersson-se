export const getSkillClassColors = (skill: string) => {
    switch (skill.toLowerCase()) {
        case 'typescript':
            return 'bg-[#3178c6] text-white';
        case 'sveltekit':
        case 'svelte':
            return 'bg-[#dd3700] text-white';
        case 'tailwind':
        case 'tailwindcss':
            return 'bg-[#00bcff] text-black';
        case 'mysql':
            return 'bg-[#3E6E93] text-white';
        case 'iis':
            return 'bg-[#043e54] text-white';
        case 'angular':
            return 'bg-angular text-white';
        case 'vue':
            return 'bg-[#42b883] text-black';
        case 'react':
            return 'bg-[#61dafb] text-black';
        case 'node':
            return 'bg-[#417e38] text-white';
        case '.net':
            return 'bg-[#512bd4] text-white';
        case 'astro':
            // Black text: white on Astro orange is only 3.1:1 and fails WCAG AA.
            return 'bg-[#ff5d01] text-black';
        case 'github':
        case 'github pages':
            return 'bg-[#24292f] text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};
