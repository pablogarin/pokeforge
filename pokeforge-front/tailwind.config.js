/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Scans all typescript and component markup for classes
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Press Start 2P"', 'monospace'],
                pokemon: ['"Press Start 2P"', 'monospace']
            },
            colors: {
                // Authentic FireRed / LeafGreen UI Palettes
                pokedexRed: '#E42828',
                leafGreen: '#45AA41',
                pkmnBgLight: '#F8F8F8', /* Standard Dialog White background */
                pkmnBgDark: '#505058',  /* Dialog Box Border color */
                pkmnText: '#484048',    /* FireRed main text color */
            },
        },
    },
    plugins: [],
}

