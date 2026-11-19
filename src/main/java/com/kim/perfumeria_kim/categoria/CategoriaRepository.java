
package com.kim.perfumeria_kim.categoria;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Verificar si existe una categoría con ese nombre
    boolean existsByNombreIgnoreCase(String nombre);

    // Verificar duplicados al actualizar, excluyendo su propio ID
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

}
