import { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, CardText, Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Importe seu arquivo de estilo CSS personalizado

function App() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [buttonColor, setButtonColor] = useState('primary');

  const toggle = () => setModal(!modal);

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
    }, 1000); // Intervalo de 1 segundo para trocar as cores

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
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

  return (
    <Container className="gradient-background">
      <h1 className="mt-5 mb-4">Lista de Produtos</h1>
      <Button color={buttonColor} onClick={toggle} className="mb-4">Adicionar Produto</Button>
      <Row>
        {products.map((product) => (
          <Col md="4" key={product.id}>
            <Card className="mb-3 card-black">
              <CardBody>
                <CardTitle tag="h5" className="text-white">{product.name}</CardTitle>
                <CardText className="text-white">Preço: R${product.price}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
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
    </Container>
  );
}

export default App;
