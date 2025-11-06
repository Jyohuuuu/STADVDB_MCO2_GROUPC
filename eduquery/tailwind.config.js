/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				inter: ["Inter", "sans-serif"],
				jakarta: ["Plus Jakarta Sans", "sans-serif"],
			},
			animation: {
				float: "float 6s ease-in-out infinite",
				glow: "glow 2s ease-in-out infinite alternate",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				glow: {
					from: { boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" },
					to: { boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)" },
				},
			},
		},
	},
	plugins: [],
};
