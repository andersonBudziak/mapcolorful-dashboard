
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
          'button-secondary': '#6C757D',
          'button-hover': {
            primary: '#007A3D',
            secondary: '#5A6268',
            cancel: '#C82333',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'merx': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
