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

function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById(id).style.display = "block";
}

window.onload = function() {
    const datos = JSON.parse(localStorage.getItem("usuarioPGN"));
    if (datos && document.getElementById("infoUsuario")) {
        document.getElementById("infoUsuario").innerText =
            "Usuario: " + datos.usuario + " | Rol: " + datos.rol;
    }

    cargarExpedientes();
};

function agregarExpediente() {
    const nombre = document.getElementById("nuevoExpediente").value;
    if (!nombre) return;

    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];
    expedientes.push(nombre);
    localStorage.setItem("expedientesPGN", JSON.stringify(expedientes));

    document.getElementById("nuevoExpediente").value = "";
    cargarExpedientes();
}

function cargarExpedientes() {
    const lista = document.getElementById("listaExpedientes");
    if (!lista) return;

    lista.innerHTML = "";
    let expedientes = JSON.parse(localStorage.getItem("expedientesPGN")) || [];

    expedientes.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = exp;
        lista.appendChild(li);
    });
}
