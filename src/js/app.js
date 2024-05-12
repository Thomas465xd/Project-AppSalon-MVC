let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: "",
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded", function() {
    iniciarApp();
});

function iniciarApp() {

    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginadores
    paginaSiguiente(); 
    paginaAnterior();

    consultarAPI(); // Consulta la API en el Backend de PHP

    idCliente(); // Genera un ID único para el cliente
    nombreCliente(); // Almacena el nombre del cliente en el objeto de cita
    seleccionarFecha(); // Almacena la fecha de la cita en el objeto de cita   
    seleccionarHora(); // Almacena la hora de la cita en el objeto de cita  
    
    mostrarResumen(); // Muestra el resumen de la cita o mensaje de error en caso de no pasar la validación 
}

function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector(".mostrar");

    if(seccionAnterior) {
        seccionAnterior.classList.remove("mostrar");
    }

    // Seleccionar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add("mostrar");

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector(".actual");
    if(tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add("actual");
}

function tabs() {
    const botones = document.querySelectorAll(".tabs button");

    botones.forEach( boton => {
        boton.addEventListener("click", function(evento) {
            paso = parseInt(evento.target.dataset.paso );

            mostrarSeccion();

            botonesPaginador();
        });
    })
}

function botonesPaginador() {

    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if(paso === 1) {
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    } else if (paso === 3) {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.add("ocultar");

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", function() {

        if(paso <= pasoInicial) return;
        paso--;

        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", function() {

        if(paso >= pasoFinal) return;
        paso++;

        botonesPaginador();
    })
}

async function consultarAPI() {

    try {
        const url = "/api/servicios";
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement("P");
        nombreServicio.classList.add("nombre-servicio");
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.classList.add("precio-servicio");
        precioServicio.textContent = `$ ${precio}`

        const servicioDiv = document.createElement("DIV");
        servicioDiv.classList.add("servicio");
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector("#servicios").appendChild(servicioDiv);
    })
}

function seleccionarServicio(servicio) {
    const {id} = servicio;
    const {servicios} = cita;

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si el servicio ya está seleccionado
    if(servicios.some( agregado => agregado.id === id)) {
        // Elimina el servicio del arreglo
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove("seleccionado");
    } else {
        // Agrega el servicio al arreglo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add("seleccionado");
    }



}

function idCliente() {
    cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
    const nombre = document.querySelector("#nombre").value;

    cita.nombre = nombre;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector("#fecha");
    inputFecha.addEventListener("input", function(evento) {
        const dia = new Date(evento.target.value).getUTCDay();

        if( [6, 0].includes(dia)) {
            evento.preventDefault();
            evento.target.value = "";
            mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
        } else {
            cita.fecha = evento.target.value;
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", function(evento) {

        // Extraer la hora
        const horaCita = evento.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18) {
            //evento.preventDefault();
            evento.target.value = "";
            mostrarAlerta("Hora no válida", "error", ".formulario");
        } else {
            cita.hora = evento.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia) {
        alertaPrevia.remove();
    }   

    // Crear la alerta
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if(tipo === "error") {
        alerta.classList.add("error");
    }

    // Insertar en el HTML
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar la alerta después de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function mostrarResumen() {
    const resumen = document.querySelector(".contenido-resumen");   

    // Limpiar el HTML previo
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes("") || cita.servicios.length === 0 ) {
        mostrarAlerta("Faltan datos de servicios, hora, fecha o nombre", "error", ".contenido-resumen", false );

        return;
    }

    // Formatear el div de resumen
    const {nombre, fecha, hora, servicios} = cita;

    // Heading para servicios en el resumen
    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";
    resumen.appendChild(headingServicios);

    // Iterando sobre los servicios
    servicios.forEach( servicio => {
        const {id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio); 

        resumen.appendChild(contenedorServicio);
    });

    // Heading para cita en el resumen
    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement("P");
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    
    const fechaFormateada = fechaUTC.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }); 

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para Crear una Cita
    const botonReservar = document.createElement("BUTTON");
    botonReservar.classList.add("boton");
    botonReservar.textContent = "Reservar Cita";
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    
    // Enviar la cita a la API
    const { nombre, fecha, hora, servicios, id } = cita;

    // Validar
    const idServicios = servicios.map( servicio => servicio.id)

    // Crear un objeto
    const datos = new FormData();
    datos.append("fecha", fecha);
    datos.append("hora", hora);
    datos.append("usuarioId", id);
    datos.append("servicios", idServicios);

    // console.log([...datos])

    try {
        // Peticion hacia la API
        const url = "/api/citas";

        // Realizar la petición
        const respuesta = await fetch(url, {
            method: "POST",
            body: datos
        });

        // finaliza la petición
        const resultado = await respuesta.json();
    
        //console.log(resultado.resultado);

        if(resultado.resultado) {
            Swal.fire({
                title: "Cita Creada",
                text: "Tu Cita se creó correctamente",
                icon: "success"
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
        });
    }

    

    
    console.log([...datos]);
}

