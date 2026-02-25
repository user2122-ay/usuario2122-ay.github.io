let usuarioActual = null;

function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const rol = document.getElementById("rol").value;

    if (!usuario || !rol) {
        alert("Complete los datos");
        return;
    }

    const datos = { usuario, rol };

    localStorage.setItem("usuarioPGN", JSON.stringify(datos));
    window.location.href = "panel.html";
}

function cerrarSesion() {
    localStorage.removeItem("usuarioPGN");
    window.location.href = "index.html";
}

window.onload = function() {
    const datos = JSON.parse(localStorage.getItem("usuarioPGN"));
    if (!datos) return;

    usuarioActual = datos;

    const info = document.getElementById("infoUsuario");
    if (info) {
        info.innerText = "Usuario: " + datos.usuario + " | Rol: " + datos.rol;
    }

    cargarExpedientes();
    cargarTextosLegales();
};

function agregarExpediente() {
    const nombre = document.getElementById("nuevoExpediente").value;
    if (!nombre) return;

    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];

    expedientes.push({
        titulo: nombre,
        texto: "",
        imagenes: []
    });

    localStorage.setItem("expedientesPGN", JSON.stringify(expedientes));
    document.getElementById("nuevoExpediente").value = "";
    cargarExpedientes();
}

function cargarExpedientes() {
    const lista = document.getElementById("listaExpedientes");
    if (!lista) return;

    lista.innerHTML = "";

    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];

    expedientes.forEach((exp, index) => {
        const div = document.createElement("div");
        div.className = "expediente";

        div.innerHTML = `
            <h3>${exp.titulo}</h3>
            <textarea onchange="guardarTexto(${index}, this.value)">${exp.texto}</textarea>
            <input type="file" onchange="subirImagen(event, ${index})">
            <div id="imagenes-${index}"></div>
            ${botonEliminar(index)}
        `;

        lista.appendChild(div);
        mostrarImagenes(index);
    });
}

function botonEliminar(index) {
    if (usuarioActual.rol === "Procurador" || usuarioActual.usuario === "Anthony") {
        return `<button onclick="eliminarExpediente(${index})">Eliminar</button>`;
    }
    return "";
}

function eliminarExpediente(index) {
    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];
    expedientes.splice(index, 1);
    localStorage.setItem("expedientesPGN", JSON.stringify(expedientes));
    cargarExpedientes();
}

function guardarTexto(index, texto) {
    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];
    expedientes[index].texto = texto;
    localStorage.setItem("expedientesPGN", JSON.stringify(expedientes));
}

function subirImagen(event, index) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];
        expedientes[index].imagenes.push(e.target.result);
        localStorage.setItem("expedientesPGN", JSON.stringify(expedientes));
        mostrarImagenes(index);
    };

    reader.readAsDataURL(file);
}

function mostrarImagenes(index) {
    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];
    const contenedor = document.getElementById(`imagenes-${index}`);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    expedientes[index].imagenes.forEach((img, i) => {
        const imagen = document.createElement("img");
        imagen.src = img;
        imagen.width = 120;

        if (usuarioActual.usuario === "Anthony") {
            const btn = document.createElement("button");
            btn.innerText = "X";
            btn.onclick = function() {
                eliminarImagen(index, i);
            };
            contenedor.appendChild(btn);
        }

        contenedor.appendChild(imagen);
    });
}

function eliminarImagen(expIndex, imgIndex) {
    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];
    expedientes[expIndex].imagenes.splice(imgIndex, 1);
    localStorage.setItem("expedientesPGN", JSON.stringify(expedientes));
    cargarExpedientes();
}

/* CONSTITUCIÓN Y CÓDIGO PENAL */

function guardarTextoLegal(tipo) {
    if (usuarioActual.usuario !== "Anthony") {
        alert("Solo el dueño puede editar esto.");
        return;
    }

    const contenido = document.getElementById(tipo).value;
    localStorage.setItem(tipo, contenido);
}

function cargarTextosLegales() {
    const constitucion = document.getElementById("constitucionTexto");
    const codigo = document.getElementById("codigoTexto");

    if (constitucion) {
        constitucion.value = localStorage.getItem("constitucionTexto") || "";
    }

    if (codigo) {
        codigo.value = localStorage.getItem("codigoTexto") || "";
    }
}
