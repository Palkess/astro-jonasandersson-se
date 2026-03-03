<script lang="ts">
    import Button from '$lib/components/base/button/button.svelte';
    import LinkedInIcon from '$lib/components/foundation/icons/LinkedInIcon.svelte';
</script>

<h2 class="mb-4 text-2xl">Erfarenhet</h2>
<ul class="timeline mb-4">
    <li class="flex flex-col">
        <span class="font-medium">Software Developer</span>
        <span class="text-sm">Tietoevry</span>
        <span class="text-sm">2021 - Pågående</span>
    </li>
    <li class="flex flex-col">
        <span class="font-medium">Front-end developer</span>
        <span class="text-sm">Alpacha AB</span>
        <span class="text-sm">2018 - 2021</span>
    </li>
    <li class="flex flex-col">
        <span class="font-medium">SEO-tekniker</span>
        <span class="text-sm">Searchminds Group AB</span>
        <span class="text-sm">2017 - 2018</span>
    </li>
    <li class="flex flex-col">
        <span class="font-medium">Lärarassistent</span>
        <span class="text-sm">Blekinge tekniska högskola</span>
        <span class="text-sm">2016 - 2017</span>
    </li>
</ul>
<div
    class="flex flex-col flex-wrap justify-center gap-4 sm:flex-row sm:items-center sm:justify-start">
    <span class="block font-medium">Läs mer:</span>
    <Button
        type="link"
        size="lg"
        class="lg:w-full "
        href="https://www.linkedin.com/in/jonas-andersson-web/"
        target="_blank">
        LinkedIn
        <LinkedInIcon />
    </Button>
</div>
