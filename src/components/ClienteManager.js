import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const API_URL = '/clientes';

const ClienteManager = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    cpf: '',
    nascimento: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(API_URL);
      setClientes(response.data);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nome: '',
      cpf: '',
      nascimento: ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      resetForm();
      fetchClientes();
    } catch (err) {
      setError(err.response?.data?.err || 'Erro ao salvar cliente');
      console.error(err);
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      nascimento: cliente.nascimento
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchClientes();
      } catch (err) {
        setError('Erro ao excluir cliente');
        console.error(err);
      }
    }
  };

  // Função para formatar a data corretamente sem perda de dia
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Utilizando split e join para evitar problemas com timezone
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="form-panel">
        <h3>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                placeholder="Digite o nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input
                type="text"
                className="form-control"
                id="cpf"
                name="cpf"
                placeholder="Digite o CPF (000.000.000-00)"
                value={formData.cpf}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
              <input
                type="date"
                className="form-control"
                id="nascimento"
                name="nascimento"
                value={formData.nascimento}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave /> Salvar
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <h3>Lista de Clientes</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de Nascimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf}</td>
                <td>{formatDate(cliente.nascimento)}</td>
                <td className="action-buttons">
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(cliente)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Nenhum cliente cadastrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClienteManager; 