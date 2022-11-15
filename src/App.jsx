import React,{Component} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
 
 
class App extends Component {
  constructor(props) {
	super(props);
  this.state = ({
    ofertas:[],
    pos:null,
    titulo:'Nueva Oferta',
    id:0,
    oferta:'',
    empresa:'',
    perfil:'',
    nivel:'',
    fecha:''
  })
  this.cambioOferta = this.cambioOferta.bind(this);
  this.cambioEmpresa = this.cambioEmpresa.bind(this);
  this.cambioPerfil = this.cambioPerfil.bind(this);
  this.cambioNivel = this.cambioNivel.bind(this);
  this.cambioFecha = this.cambioFecha.bind(this);
  this.mostrar = this.mostrar.bind(this);
  this.eliminar = this.eliminar.bind(this);
  this.guardar = this.guardar.bind(this);
}
cambioOferta(e){
  this.setState({
    oferta: e.target.value
  })
}
cambioEmpresa(e){
  this.setState({
    empresa: e.target.value
  })
}
cambioPerfil(e){
  this.setState({
    perfil: e.target.value
  })
}
cambioNivel(e){
  this.setState({
    nivel: e.target.value
  })
}
cambioFecha(e){
  this.setState({
    fecha: e.target.value
  })
}
  componentDidMount(){
    axios.get('http://localhost:8000/oferta')
    .then(res =>{
      console.log(res.data);
      this.setState({ofertas: res.data})
    })
  }
  mostrar(cod,index){
    axios.get('http://localhost:8000/oferta/'+cod)
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar Oferta',
        id: res.data.id,
        oferta :res.data.titulo,
        empresa:res.data.empresa,
        perfil:res.data.perfil,
        nivel:res.data.nivel,
        fecha: res.data.pub_date
      })
    })
  }
  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    const datos = {
      titulo:this.state.oferta,
      empresa:this.state.empresa,
      perfil:this.state.perfil,
      nivel:this.state.nivel,
      pub_date: this.state.fecha
    }
    if(cod>0){
      axios.put('http://localhost:8000/oferta/'+cod,datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.ofertas[indx] = res.data;
        var temp = this.state.ofertas;
        this.setState({
          pos:null,
          titulo:'Nueva Oferta',
          id:0,
          oferta:'',
          empresa:'',
          perfil:'',
          nivel:'',
          fecha:'',
          ofertas: temp
        });
      }).catch((error) =>{
        console.log(error.toString());
      });
    }else{
      //nuevo registro
      axios.post('http://localhost:8000/oferta',datos)
      .then(res => {
        this.state.ofertas.push(res.data);
        var temp = this.state.ofertas;
        this.setState({
          id:0,
          oferta:'',
          empresa:'',
          perfil:'',
          nivel:'',
          fecha:'',
          ofertas: temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }
  }
  eliminar(cod){
    let rpta = window.confirm("Desea Eliminar?");
    if(rpta){
      axios.delete('http://localhost:8000/oferta/'+cod)
      .then(res =>{
        var temp = this.state.ofertas.filter((oferta)=>oferta.id !== cod);
        this.setState({
          ofertas: temp
        })
      })
    }
  }



  render() {
    return (<div>
      <Container>
              <Table striped bordered hover variant="ligt">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titulo</th>
                  <th>Empresa</th>
                  <th>Perfil</th>
                  <th>Nivel</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.ofertas.map( (oferta,index) =>{
                  return (
                    <tr key={oferta.id}>
                      <td>{oferta.id}</td>
                      <td>{oferta.titulo}</td>
                      <td>{oferta.empresa}</td>
                      <td>{oferta.perfil}</td>
                      <td>{oferta.nivel}</td>
                      <td>
                      <Button variant="success" onClick={()=>this.mostrar(oferta.id,index)}>Editar</Button>
                      <Button variant="danger" onClick={()=>this.eliminar(oferta.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <hr />
            <h1>{this.state.titulo}</h1>
            <Form onSubmit={this.guardar}>
              <Form.Control type="hidden" value={this.state.id} />
              <Form.Group className="mb-3">
                <Form.Label>Ingrese la oferta:</Form.Label>
                <Form.Control type="text" value={this.state.oferta} onChange={this.cambioOferta} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese el nombre de la empresa:</Form.Label>
                <Form.Control type="text" value={this.state.empresa} onChange={this.cambioEmpresa} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese el Perfil:</Form.Label>
                <Form.Control type="text" value={this.state.perfil} onChange={this.cambioPerfil} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nivel:</Form.Label>
                <Form.Control type="text" value={this.state.nivel} onChange={this.cambioNivel} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha:</Form.Label>
                <Form.Control type="date" value={this.state.fecha} onChange={this.cambioFecha} />
              </Form.Group>
              <Button variant="primary" type="submit">
                GUARDAR
              </Button>
          </Form>
          <br></br>
        </Container>

    </div>)
  }
}
export default App;
