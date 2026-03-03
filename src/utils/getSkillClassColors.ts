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
        case 'node':
            return 'bg-[#417e38] text-white';
        case '.net':
            return 'bg-[#512bd4] text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};
