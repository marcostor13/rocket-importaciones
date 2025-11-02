/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#111111',
				secondary: '#444444',
				accent: '#00c7ff',
				'accent-hover': '#00aacc',
			},
			fontFamily: {
				sans: ['Poppins', 'Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
};

