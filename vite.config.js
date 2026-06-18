import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'frontend',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../public/react',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/alunos': 'http://localhost:3333',
      '/cidades': 'http://localhost:3333',
      '/estados': 'http://localhost:3333',
      '/instituicoes-ensino': 'http://localhost:3333',
      '/matriculas-transporte': 'http://localhost:3333',
      '/motoristas': 'http://localhost:3333',
      '/onibus': 'http://localhost:3333',
      '/prefeituras': 'http://localhost:3333',
      '/registros-acesso': 'http://localhost:3333',
      '/rotas': 'http://localhost:3333',
      '/viagens': 'http://localhost:3333'
    }
  }
});
