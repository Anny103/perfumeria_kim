
// ======================================
// 1. ELEMENTOS HTML
// ======================================

const tabla = document.getElementById("tablaCategorias");

const botonNuevo = document.getElementById("btnNuevaCategoria");
const botonCancelar = document.getElementById("btnCancelarCategoria");
const botonGuardar = document.getElementById("btnGuardarCategoria");

const modal = document.getElementById("modalCategoria");
const formulario = document.getElementById("formCategoria");

const idCategoria = document.getElementById("idCategoria");
const nombreCategoria = document.getElementById("nombreCategoria");
const descripcionCategoria = document.getElementById("descripcionCategoria");

const tituloModal = document.getElementById("tituloModal");


// ======================================
// 2. LISTAR CATEGORÍAS
// ======================================

async function cargarCategorias() {

    try {

        const respuesta = await fetch("/api/categorias/listar");

        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        const categorias = await respuesta.json();

        tabla.replaceChildren();

        if (!Array.isArray(categorias) || categorias.length === 0) {

            const fila = tabla.insertRow();
            const celda = fila.insertCell();

            celda.colSpan = 4;
            celda.textContent = "No hay categorías registradas";

            return;
        }

        categorias.forEach(categoria => {

            const fila = tabla.insertRow();

            // Datos de la categoría
            const datos = [
                categoria.id,
                categoria.nombre,
                categoria.descripcion
            ];

            datos.forEach(dato => {

                const celda = fila.insertCell();
                celda.textContent = dato ?? "";

            });

            // Columna de acciones
            const celdaAcciones = fila.insertCell();

            // Botón EDITAR
            const btnEditar = document.createElement("button");

            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-editar";

            btnEditar.addEventListener("click", () => {
                editarCategoria(categoria);
            });

            // Botón ELIMINAR
            const btnEliminar = document.createElement("button");

            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-eliminar";

            btnEliminar.addEventListener("click", () => {
                eliminarCategoria(categoria.id);
            });

            celdaAcciones.append(btnEditar, btnEliminar);

        });

    } catch (error) {

        console.error("Error al cargar categorías:", error);

        tabla.replaceChildren();

        const fila = tabla.insertRow();
        const celda = fila.insertCell();

        celda.colSpan = 4;
        celda.textContent = "No se pudieron cargar las categorías";

    }
}


// ======================================
// 3. ABRIR MODAL PARA NUEVA CATEGORÍA
// ======================================

botonNuevo.addEventListener("click", () => {

    formulario.reset();

    idCategoria.value = "";

    tituloModal.textContent = "Registrar categoría";

    botonGuardar.textContent = "Guardar categoría";

    modal.classList.remove("oculto");

    nombreCategoria.focus();

});


// ======================================
// 4. CERRAR MODAL
// ======================================

botonCancelar.addEventListener("click", () => {

    modal.classList.add("oculto");

    formulario.reset();

});


// ======================================
// 5. REGISTRAR / ACTUALIZAR CATEGORÍA
// ======================================

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const categoria = {

        nombre: nombreCategoria.value.trim(),

        descripcion: descripcionCategoria.value.trim()

    };

    // Validar nombre
    if (!categoria.nombre) {

        alert("Ingrese el nombre de la categoría");

        nombreCategoria.focus();

        return;
    }

    // Determinar si es registro o actualización
    const id = idCategoria.value;

    const editar = id !== "";

    const url = editar
        ? `/api/categorias/actualizar/${id}`
        : "/api/categorias/crear";

    try {

        botonGuardar.disabled = true;

        botonGuardar.textContent = "Guardando...";

        const respuesta = await fetch(url, {

            method: editar ? "PUT" : "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(categoria)

        });

        if (!respuesta.ok) {

            const mensaje = await respuesta.text();

            throw new Error(
                mensaje || "Error HTTP: " + respuesta.status
            );

        }

        alert(
            editar
                ? "¡Categoría actualizada correctamente!"
                : "¡Categoría registrada correctamente!"
        );

        // Cerrar formulario
        modal.classList.add("oculto");

        formulario.reset();

        // Actualizar tabla
        await cargarCategorias();

    } catch (error) {

        console.error("Error al guardar categoría:", error);

        alert("No se pudo guardar la categoría: " + error.message);

    } finally {

        botonGuardar.disabled = false;

        botonGuardar.textContent = idCategoria.value
            ? "Actualizar categoría"
            : "Guardar categoría";

    }

});


// ======================================
// 6. EDITAR CATEGORÍA
// ======================================

function editarCategoria(categoria) {

    idCategoria.value = categoria.id;

    nombreCategoria.value = categoria.nombre;

    descripcionCategoria.value = categoria.descripcion ?? "";

    tituloModal.textContent = "Editar categoría";

    botonGuardar.textContent = "Actualizar categoría";

    modal.classList.remove("oculto");

    nombreCategoria.focus();

}


// ======================================
// 7. ELIMINAR CATEGORÍA
// ======================================

async function eliminarCategoria(id) {

    const confirmar = confirm(
        "¿Está seguro de eliminar esta categoría?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `/api/categorias/eliminar/${id}`,
            {
                method: "DELETE"
            }
        );

        //capturar los errores enviados por el backend

        if (!respuesta.ok) {

            const mensaje = await respuesta.text();

            throw new Error(
                mensaje || "Error HTTP: " + respuesta.status
            );
        }

        alert("¡Categoría eliminada correctamente!");

        // Actualizar tabla
        await cargarCategorias();

     } catch (error) {

        console.error("Error al eliminar categoría:", error);

        alert(error.message);

    }

}


// ======================================
// 8. INICIAR SISTEMA
// ======================================

cargarCategorias();
