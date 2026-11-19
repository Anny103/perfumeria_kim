
package com.kim.perfumeria_kim.categoria;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repo;

    public CategoriaController(CategoriaRepository repo) {
        this.repo = repo;
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
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
