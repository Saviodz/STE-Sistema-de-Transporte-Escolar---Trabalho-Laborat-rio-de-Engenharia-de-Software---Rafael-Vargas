import React, { useState } from 'react';
import { FaUser, FaHome } from 'react-icons/fa';
import ClienteManager from './components/ClienteManager';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('clientes');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <img src="logo.jpg" alt="RVM Logo" className="logo-img" />
        </div>
        <div 
          className={`menu-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => handlePageChange('home')}
        >
          <FaHome /> Início
        </div>
        <div 
          className={`menu-item ${currentPage === 'clientes' ? 'active' : ''}`}
          onClick={() => handlePageChange('clientes')}
        >
          <FaUser /> Clientes
        </div>
      </div>
      
      <div className="main-content">
        <div className="content-header">
          <h1><FaUser /> Clientes</h1>
          <p>Cadastro de clientes: Incluir, Listar, Alterar e Excluir!</p>
        </div>
        
        {currentPage === 'clientes' && <ClienteManager />}
        {currentPage === 'home' && (
          <div className="welcome-content">
            <h2>Bem-vindo ao Sistema de Gerenciamento de Clientes</h2>
            <p>Utilize o menu lateral para navegar entre as funcionalidades.</p>
          </div>
        )}
      </div>
      
      <div className="footer">
        <p>Aplicação Front-End com React - Back-End em Node.js + Sequelize: Desenvolvido por <span style={{fontWeight: 'bold'}}>Rafael Vargas Mesquita</span></p>
      </div>
    </div>
  );
}

export default App; 