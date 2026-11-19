
package com.kim.perfumeria_kim.perfume;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerfumeRepository
        extends JpaRepository<Perfume, Long> {

    List<Perfume> findByCategoriaId(Long id);
}
