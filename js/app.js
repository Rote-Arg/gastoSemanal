// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos

eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto);
}


// Clases
class Presupuesto {
    constructor (presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce(( total, gasto ) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante()
    }
}

class UI {
    
    insertarPresupuesto( cantidad ){
        // Extrayendo el valor con destructuring
        const { presupuesto, restante} = cantidad;

        // Agregando al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error 
        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);
        
        // Quitarlo del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    mostrarGastos(gastos){

        this.limpiarHTML(); // Limpiar el HTML previo

        // Iterar sobre los gastos
        gastos.forEach( gasto => {
            const {cantidad, nombre, id} = gasto;

            // Crear LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // funciona igual que la linea de abajo nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id= id;
            
            // Agregar el HTML del gasto
            nuevoGasto.innerHTML= 
            `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;
            
            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar boton al HTML
            gastoListado.appendChild(nuevoGasto);           
        })
    }
    
    limpiarHTML() {
        while( gastoListado.firstChild ){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');


        // Comprobar 25%
        if( (presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es menor a 0
        if(restante <= 0){
            ui.imprimirAlerta('Presupuesto agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instanciar
const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cúal es su presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

// Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar 

    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}; // Esta sintaxis es lo contrario a destructuring, es decir, Asigna en lugar de sacar los valores. Ademas, al tener el mismo nombre en llave y valor basta con poner este una sola vez y javascript ya sabe que lo esta replicando
    
    // Agrega un nuevo gasto
    presupuesto.nuevoGasto(gasto);
   
    // Mensaje si es correcto el proceso
    ui.imprimirAlerta('Gasto agregado correctamente');
   
    // Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    
    ui.actualizarRestante(restante);
    
    ui.comprobarPresupuesto(presupuesto);
    // Resetea el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //Elimina del objeto
    presupuesto.eliminarGasto(id);

    // Elimina del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}