

// ======================================
// 1. ELEMENTOS HTML
// ======================================

const tabla = document.getElementById("tablaPerfumes");

const botonNuevo = document.getElementById("btnNuevo");
const botonCancelar = document.getElementById("btnCancelar");
const botonGuardar = document.getElementById("btnGuardar");

const modal = document.getElementById("modalPerfume");
const formulario = document.getElementById("formPerfume");

const idPerfume = document.getElementById("idPerfume");
const nombre = document.getElementById("nombre");
const marca = document.getElementById("marca");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");

const selectCategoria = document.getElementById("categoria");
const tituloModal = document.getElementById("tituloModal");


// ======================================
// 2. LISTAR PERFUMES
// ======================================

async function cargarPerfumes() {

    try {

        const respuesta = await fetch("/api/perfumes/listar");

        if (!respuesta.ok) {
            throw new Error("Error al consultar perfumes");
        }

        const perfumes = await respuesta.json();

        tabla.replaceChildren();

        if (perfumes.length === 0) {

            const fila = tabla.insertRow();
            const celda = fila.insertCell();

            celda.colSpan = 7;
            celda.textContent = "No hay perfumes registrados";

            return;
        }

        perfumes.forEach(perfume => {

            const fila = tabla.insertRow();

            // Datos del perfume
            const datos = [
                perfume.id,
                perfume.nombre,
                perfume.marca,
                perfume.precio,
                perfume.stock,
                perfume.categoria?.nombre ?? "Sin categoría"
            ];

            datos.forEach(dato => {

                const celda = fila.insertCell();
                celda.textContent = dato ?? "";

            });

            // COLUMNA ACCIONES
            const celdaAcciones = fila.insertCell();

            // BOTÓN EDITAR
            const btnEditar = document.createElement("button");

            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-editar";
            btnEditar.type = "button";

            btnEditar.addEventListener("click", () => {
                editarPerfume(perfume);
            });

            // BOTÓN ELIMINAR
            const btnEliminar = document.createElement("button");

            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-eliminar";
            btnEliminar.type = "button";

            btnEliminar.addEventListener("click", () => {
                eliminarPerfume(perfume.id);
            });

            celdaAcciones.append(btnEditar, btnEliminar);

        });

    } catch (error) {

        console.error("Error al cargar perfumes:", error);

        tabla.replaceChildren();

        const fila = tabla.insertRow();
        const celda = fila.insertCell();

        celda.colSpan = 7;
        celda.textContent = "No se pudieron cargar los perfumes";

    }
}


// ======================================
// 3. CARGAR CATEGORÍAS
// ======================================

async function cargarCategorias() {

    try {

        const respuesta = await fetch("/api/categorias/listar");

        if (!respuesta.ok) {
            throw new Error("Error al consultar categorías");
        }

        const categorias = await respuesta.json();

        selectCategoria.replaceChildren();

        const opcionInicial = document.createElement("option");

        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccione una categoría";

        selectCategoria.appendChild(opcionInicial);

        categorias.forEach(categoria => {

            const opcion = document.createElement("option");

            opcion.value = categoria.id;
            opcion.textContent = categoria.nombre;

            selectCategoria.appendChild(opcion);

        });

        return categorias;

    } catch (error) {

        console.error("Error al cargar categorías:", error);

        alert("No se pudieron cargar las categorías.");

        throw error;

    }
}


// ======================================
// 4. ABRIR FORMULARIO NUEVO
// ======================================

botonNuevo.addEventListener("click", async () => {

    formulario.reset();

    idPerfume.value = "";

    tituloModal.textContent = "Registrar nuevo perfume";

    botonGuardar.textContent = "Guardar perfume";

    try {

        await cargarCategorias();

        modal.classList.remove("oculto");

        nombre.focus();

    } catch (error) {

        console.error(error);

    }

});


// ======================================
// 5. CERRAR FORMULARIO
// ======================================

botonCancelar.addEventListener("click", () => {

    modal.classList.add("oculto");

    formulario.reset();

    idPerfume.value = "";

    tituloModal.textContent = "Registrar nuevo perfume";

    botonGuardar.textContent = "Guardar perfume";

});


// ======================================
// 6. REGISTRAR / ACTUALIZAR PERFUME
// ======================================

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const perfume = {

        nombre: nombre.value.trim(),

        marca: marca.value.trim(),

        precio: Number(precio.value),

        stock: Number(stock.value),

        categoria: {
            id: Number(selectCategoria.value)
        }

    };

    // VALIDACIONES
    if (
        !perfume.nombre ||
        !perfume.marca ||
        !perfume.categoria.id ||
        !Number.isFinite(perfume.precio) ||
        perfume.precio <= 0 ||
        !Number.isInteger(perfume.stock) ||
        perfume.stock < 0
    ) {

        alert("Verifique los datos del formulario.");

        return;
    }

    // Determinar operación
    const id = idPerfume.value;

    const editar = id !== "";

    const url = editar
        ? `/api/perfumes/actualizar/${id}`
        : "/api/perfumes/crear";

    try {

        botonGuardar.disabled = true;

        botonGuardar.textContent = editar
            ? "Actualizando..."
            : "Guardando...";

        const respuesta = await fetch(url, {

            method: editar ? "PUT" : "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(perfume)

        });

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo guardar el perfume. Código: " +
                respuesta.status
            );

        }

        alert(
            editar
                ? "¡Perfume actualizado correctamente!"
                : "¡Perfume registrado correctamente!"
        );

        modal.classList.add("oculto");

        formulario.reset();

        idPerfume.value = "";

        tituloModal.textContent = "Registrar nuevo perfume";

        await cargarPerfumes();

    } catch (error) {

        console.error("Error al guardar perfume:", error);

        alert(error.message);

    } finally {

        botonGuardar.disabled = false;

        botonGuardar.textContent = "Guardar perfume";

    }

});


// ======================================
// 7. EDITAR PERFUME
// ======================================

async function editarPerfume(perfume) {

    try {

        formulario.reset();

        // Cargar categorías antes de seleccionar
        await cargarCategorias();

        // Recuperar información
        idPerfume.value = perfume.id;

        nombre.value = perfume.nombre;

        marca.value = perfume.marca;

        precio.value = perfume.precio;

        stock.value = perfume.stock;

        selectCategoria.value = perfume.categoria?.id ?? "";

        // Cambiar título y botón
        tituloModal.textContent = "Editar perfume";

        botonGuardar.textContent = "Actualizar perfume";

        // Mostrar formulario
        modal.classList.remove("oculto");

        nombre.focus();

    } catch (error) {

        console.error("Error al editar perfume:", error);

    }

}


// ======================================
// 8. ELIMINAR PERFUME
// ======================================

async function eliminarPerfume(id) {

    const confirmar = confirm(
        "¿Está seguro de eliminar este perfume?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `/api/perfumes/eliminar/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo eliminar el perfume. Código: " +
                respuesta.status
            );

        }

        alert("¡Perfume eliminado correctamente!");

        await cargarPerfumes();

    } catch (error) {

        console.error("Error al eliminar perfume:", error);

        alert(error.message);

    }

}


// ======================================
// 9. INICIAR SISTEMA
// ======================================

cargarPerfumes();
