
package com.kim.perfumeria_kim.categoria;

import com.kim.perfumeria_kim.perfume.PerfumeRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repo;
    private final PerfumeRepository perfumeRepo;

    public CategoriaController(
            CategoriaRepository repo,
            PerfumeRepository perfumeRepo) {

        this.repo = repo;
        this.perfumeRepo = perfumeRepo;
    }

    // GET: listar categorías
    @GetMapping("/listar")
    public List<Categoria> listar() {
        return repo.findAll();
    }

    // GET: buscar categoría por ID
    @GetMapping("/obtener/{id}")
    public ResponseEntity<Categoria> obtener(@PathVariable Long id) {

        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: crear categoría
    @PostMapping("/crear")
    public Categoria crear(@RequestBody Categoria categoria) {

        categoria.setId(null);

        return repo.save(categoria);
    }

    // PUT: actualizar categoría
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Categoria> actualizar(
            @PathVariable Long id,
            @RequestBody Categoria datos) {

        return repo.findById(id).map(categoria -> {

            categoria.setNombre(datos.getNombre());
            categoria.setDescripcion(datos.getDescripcion());

            return ResponseEntity.ok(repo.save(categoria));

        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: eliminar categoría
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {

        // Comprobar si existe la categoría
        if (!repo.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        // Comprobar si tiene perfumes asociados
        if (perfumeRepo.existsByCategoria_Id(id)) {

            return ResponseEntity
                    .status(409)
                    .body("No se puede eliminar esta categoría porque tiene perfumes asociados.");
        }

        // Si no tiene perfumes, permitir eliminación
        repo.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}