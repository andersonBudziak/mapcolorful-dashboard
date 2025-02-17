
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        merx: {
          primary: '#009B4D',    // Verde MERX
          secondary: '#4A4A4A',  // Cinza Escuro
          background: '#F9F9F9', // Fundo Claro
          border: '#E0E0E0',     // Bordas e Separadores
          text: '#212121',       // Texto Principal
          success: '#28A745',    // Disponível
          warning: '#FFC107',    // Processando
          error: '#DC3545',      // Erro
          placeholder: '#BDBDBD', // Placeholder
          'button-secondary': '#6C757D',
          'button-hover': {
            primary: '#007A3D',
            secondary: '#5A6268',
            cancel: '#C82333',
          },
          table: {
            header: '#F0F0F0',
            alternate: '#F9F9F9',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'merx': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'merx-modal': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
