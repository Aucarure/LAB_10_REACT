import React, { Component } from 'react';
import './App.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      recuperado: false,
      dialogOpen: false,
      nuevoCodigo: '',
      nuevaDescripcion: '',
      nuevoPrecio: '',
      error: null
    };
  }

  componentDidMount() {
    console.log('Intentando cargar productos...');
    
    fetch('http://localhost:8000/api/productos/')
      .then(respuesta => {
        console.log('Respuesta recibida:', respuesta);
        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        return respuesta.json();
      })
      .then(prod => {
        console.log('Productos recibidos:', prod);
        this.setState({
          productos: prod,
          recuperado: true,
          error: null
        });
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        this.setState({ 
          recuperado: true,
          error: 'Error al cargar productos: ' + error.message
        });
      });
  }

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({
      dialogOpen: false,
      nuevoCodigo: '',
      nuevaDescripcion: '',
      nuevoPrecio: ''
    });
  };

  handleAgregarProducto = () => {
    const { nuevoCodigo, nuevaDescripcion, nuevoPrecio } = this.state;
    
    // Validación
    if (!nuevoCodigo || !nuevaDescripcion || !nuevoPrecio) {
      alert('Por favor complete todos los campos');
      return;
    }

    const nuevoProducto = {
      codigo: parseInt(nuevoCodigo),
      descripcion: nuevaDescripcion,
      precio: parseFloat(nuevoPrecio)
    };

    console.log('Enviando nuevo producto:', nuevoProducto);

    fetch('http://localhost:8000/api/productos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then(response => {
        console.log('Respuesta POST:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Producto agregado:', data);
        this.setState(prevState => ({
          productos: [...prevState.productos, data],
          dialogOpen: false,
          nuevoCodigo: '',
          nuevaDescripcion: '',
          nuevoPrecio: '',
          error: null
        }));
      })
      .catch(error => {
        console.error('Error al agregar producto:', error);
        alert('Error al agregar el producto: ' + error.message);
      });
  };

  mostrarTabla() {
    const { productos, error } = this.state;

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Lista de Productos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={this.handleOpenDialog}
          >
            Agregar Producto
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" color="textSecondary" sx={{ py: 3 }}>
                      No hay productos disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                productos.map((producto) => (
                  <TableRow
                    key={producto.codigo}
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell>{producto.codigo}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>S/. {parseFloat(producto.precio).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog}>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Código"
              type="number"
              fullWidth
              variant="outlined"
              value={this.state.nuevoCodigo}
              onChange={(e) => this.setState({ nuevoCodigo: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              variant="outlined"
              value={this.state.nuevaDescripcion}
              onChange={(e) => this.setState({ nuevaDescripcion: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Precio"
              type="number"
              fullWidth
              variant="outlined"
              value={this.state.nuevoPrecio}
              onChange={(e) => this.setState({ nuevoPrecio: e.target.value })}
              inputProps={{ step: "0.01" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog}>Cancelar</Button>
            <Button onClick={this.handleAgregarProducto} variant="contained" color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  render() {
    if (this.state.recuperado) {
      return this.mostrarTabla();
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Recuperando datos...
          </Typography>
        </Box>
      );
    }
  }
}

export default App;