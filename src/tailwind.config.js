/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "../index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Prompt', 'sans-serif'],
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
                    50: '#F0F7FF',
                    100: '#E0EFFE',
                    200: '#BAE0FD',
                    300: '#7CC5F8',
                    400: '#36A5ED',
                    500: '#0085DB', // Main Brand Color
                    600: '#0066B3',
                    700: '#005191',
                    800: '#004478',
                    900: '#003964',
                    950: '#002543',
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
                'gradient-primary': 'linear-gradient(135deg, #00A5E3 0%, #0085DB 100%)',
                'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%)',
                'gradient-mesh': 'radial-gradient(at 0% 0%, hsla(203,88%,42%,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(190,100%,45%,0.1) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
}
