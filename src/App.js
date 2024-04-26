import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, CardText, Container, Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

function App() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [buttonColor, setButtonColor] = useState('primary');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const toggle = () => setModal(!modal);
  const toggleEditModal = () => setEditModal(!editModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const url = "http://localhost:3000/products";

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setButtonColor((prevColor) => {
        switch (prevColor) {
          case 'primary':
            return 'success';
          case 'success':
            return 'dark';
          case 'dark':
            return 'primary';
          default:
            return 'primary';
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });
    const data = await res.json();
    setProducts([...products, data]);
    toggle();
    setNewProduct({ name: '', price: '' });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    toggleEditModal();
  };

  const handleDelete = (product) => {
    setDeleteProduct(product);
    toggleDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    const res = await fetch(`${url}/${deleteProduct.id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setProducts(products.filter(p => p.id !== deleteProduct.id));
    }
    toggleDeleteModal();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${url}/${editProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editProduct)
    });
    if (res.ok) {
      setProducts(products.map(p => (p.id === editProduct.id ? editProduct : p)));
      toggleEditModal();
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Container className="gradient-background">
      <h1 className="mt-5 mb-4">Lista de Produtos</h1>
      <Button color={buttonColor} onClick={toggle} className="mb-4">Adicionar Produto</Button>
      <hr/>
      <Row>
        {currentProducts.map((product) => (
          <Col md="4" key={product.id}>
            <Card className="mb-3 card-black">
              <CardBody>
                <CardTitle tag="h5" className="text-white">{product.name}</CardTitle>
                <CardText className="text-white">Preço: R${product.price}</CardText>
                <div className="d-flex justify-content-between align-items-center">
                  <RiEdit2Line size={24} style={{ cursor: 'pointer', marginRight: 10 }} onClick={() => handleEdit(product)} />
                  <RiDeleteBinLine size={24} style={{ cursor: 'pointer' }} onClick={() => handleDelete(product)} />
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Container style={{ display: 'flex', justifyContent: 'center' }}>
      <Pagination size='lg'>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink first onClick={() => paginate(1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
        </PaginationItem>
        {[...Array(Math.ceil(products.length / productsPerPage))].map((_, index) => (
          <PaginationItem key={index} active={index + 1 === currentPage}>
            <PaginationLink onClick={() => paginate(index + 1)}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === Math.ceil(products.length / productsPerPage)}>
          <PaginationLink next onClick={() => paginate(currentPage + 1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === Math.ceil(products.length / productsPerPage)}>
          <PaginationLink last onClick={() => paginate(Math.ceil(products.length / productsPerPage))} />
        </PaginationItem>
      </Pagination>
      </Container>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Novo Produto</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <label>Nome do Produto:</label>
            <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className="form-control mb-2" />
            <label>Preço do Produto:</label>
            <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} className="form-control" />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Adicionar</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Editar Produto</ModalHeader>
        <ModalBody>
          <form onSubmit={handleEditSubmit}>
            <label>Nome do Produto:</label>
            <input type="text" name="name" value={editProduct?.name} onChange={handleEditInputChange} className="form-control mb-2" />
            <label>Preço do Produto:</label>
            <input type="text" name="price" value={editProduct?.price} onChange={handleEditInputChange} className="form-control" />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditSubmit}>Salvar</Button>{' '}
          <Button color="secondary" onClick={toggleEditModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirmar exclusão</ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir o produto "{deleteProduct?.name}"?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteConfirm}>Sim, excluir</Button>{' '}
          <Button color="secondary" onClick={toggleDeleteModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default App;
