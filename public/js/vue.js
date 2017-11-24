
    // Direccion de la aplicacion
    var host = "https://hackspacem.herokuapp.com";
    // Listado de especialidades
    var app_especialidad = new Vue({
      el: '#app_especialidad',
      data: {
        host: host,
        especialidades: []
      },
      created: function(){
        this.cargar_especialidades();
      },
      methods: {
        cargar_especialidades: function(){
          var config = {
            headers: {
             'Access-Control-Allow-Origin': '*',
             'Content-Type': 'application/json',
            }
          };
          axios.get(host+'/api/specialities',config)
          .then(function(response){
            app_especialidad.especialidades = response.data;   
            app_form.especialidades = response.data;  
          })
        }  
      }  
    })

// Listado de usuarios
var app_usuario = new Vue({
  el: '#app_usuario',
  data: {
    host: host,
    usuarios: [],
    especialidades : []
  },
  created: function(){
    this.cargar_usuarios();
  },
  methods: {
    cargar_usuarios: function(){
      var config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'POST, GET, UPDATE, DELETE, OPTIONS'
        }
      };
      axios.get(host+'/api/users',config)
      .then(function(response){
       app_usuario.usuarios = response.data;
      })
    },
    mostrar_formulario_agregar: function(){
      app_form.mostrar = true;
      app_form.titulo = "Nuevo Usuario";
      app_form.nombres = "";
      app_form.email = "";
      app_form.especialidad = "FRONTEND";
      app_form.username = "";
      app_form.imagen = 'frontend.png';
      app_form.titulo_boton = "AGREGAR";
    },
    mostrar_formulario_editar: function(usuario){
      app_form.mostrar = true;
      app_form.titulo_boton = "EDITAR";
      app_form.titulo = usuario.nombres;
      app_form.nombres = usuario.nombres;
      app_form.email = usuario.email;
      app_form.especialidad = usuario.especialidad;
      app_form.username = usuario.username;
      app_form.imagen = usuario.especialidad.toLowerCase() + '.png';
      app_form.old_username = usuario.username;
    },
    eliminar: function(usuario){
      axios.defaults.headers.common['Authorization'] = 'Basic TmVzdG9yUGxhc2VuY2lhOjEyMzQ1Ng==';
      var config = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
      };
      axios.delete(host+'/api/users/' + usuario.username,config)
      .then(function(response){
        app_usuario.cargar_usuarios();
        app_especialidad.cargar_especialidades();
      })
    } 
  },
})

// Listado de usuarios
var app_form = new Vue({
  el: '#app_form',
  data: {
    host: host,
    titulo: "Nuevo Usuario",
    nombres: "",
    email: "",
    especialidad: "FRONTEND",
    username: "",
    password: "",
    imagen: "frontend.png",
    especialidades : [],
    mostrar: false,
    titulo_boton: "AGREGAR",
    old_username: "",
  },  
  methods:{
    escoger: function(){
      this.imagen = this.especialidad.toLowerCase() + '.png';
    },
    submit: function(){
      console.log("Se ejecuta el metodo submmit");
    },
    cancelar: function(){
      this.mostrar = false;
    },
    agregar: function(){
      this.mostrar = false;
       axios.defaults.headers.common['Authorization'] = 'Basic TmVzdG9yUGxhc2VuY2lhOjEyMzQ1Ng';
       var data =  {
        nombres: this.nombres,
        email: this.email,
        especialidad: this.especialidad,
        username: this.username,
        password: this.password,
      };
            if(this.titulo_boton == "AGREGAR" ){
        axios.post( host +'/api/users',data)
        .then(function(response){
          app_usuario.cargar_usuarios();
          app_especialidad.cargar_especialidades();
        })  
      }
      if(this.titulo_boton == "EDITAR"){
        axios.put( host +'/api/users/'+ this.old_username,data)
        .then(function(response){
          app_usuario.cargar_usuarios();
          app_especialidad.cargar_especialidades();
        })  
      }
    },
  } 
})