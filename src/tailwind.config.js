/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "../index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Prompt', 'Inter', 'sans-serif'],
            },
            colors: {
                gray: {
                    50: '#F5F8FA',
                    100: '#EAEFF4',
                    200: '#D0DCE7',
                    300: '#AABCCA',
                    400: '#8099B0',
                    500: '#607991',
                    600: '#4C6176',
                    700: '#3E4F60',
                    800: '#344250',
                    900: '#2E3842',
                    950: '#1a202c', // Added darker shade for contrast
                },
                primary: {
                    50: 'var(--color-primary-50)',
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                    300: 'var(--color-primary-300)',
                    400: 'var(--color-primary-400)',
                    500: 'var(--color-primary-500)',
                    600: 'var(--color-primary-600)',
                    700: 'var(--color-primary-700)',
                    800: 'var(--color-primary-800)',
                    900: 'var(--color-primary-900)',
                    950: 'var(--color-primary-950)',
                },
                secondary: {
                    50: '#F5F8FA',
                    100: '#EAEFF4',
                    200: '#D0DCE7',
                    300: '#AABCCA',
                    400: '#8099B0',
                    500: '#607991',
                    600: '#4C6176',
                    700: '#3E4F60',
                    800: '#344250',
                    900: '#2E3842',
                },
                accent: {
                    500: '#00C4CC', // Teal accent
                    600: '#009AA1',
                }
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 10px 40px -10px rgba(0,0,0,0.08)',
                'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)',
                'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%)',
                'gradient-mesh': 'radial-gradient(at 0% 0%, hsla(203,88%,42%,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(190,100%,45%,0.1) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
}
