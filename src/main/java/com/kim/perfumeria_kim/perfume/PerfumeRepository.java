
package com.kim.perfumeria_kim.perfume;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerfumeRepository extends JpaRepository<Perfume, Long> {

    // Buscar perfumes por categoría
    List<Perfume> findByCategoriaId(Long id);

    // Comprobar si una categoría tiene perfumes asociados
    boolean existsByCategoria_Id(Long id);

}
