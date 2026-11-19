
package com.kim.perfumeria_kim.perfume;

import com.kim.perfumeria_kim.categoria.Categoria;
import com.kim.perfumeria_kim.categoria.CategoriaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/perfumes")
public class PerfumeController {

    private final PerfumeRepository repo;
    private final CategoriaRepository categoriaRepo;

    public PerfumeController(
            PerfumeRepository repo,
            CategoriaRepository categoriaRepo) {

        this.repo = repo;
        this.categoriaRepo = categoriaRepo;
    }

    // GET: listar perfumes
    @GetMapping("/listar")
    public List<Perfume> listar() {
        return repo.findAll();
    }

    // GET: obtener perfume por ID
    @GetMapping("/obtener/{id}")
    public ResponseEntity<Perfume> obtener(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: filtrar perfumes por categoría
    @GetMapping("/categoria/{id}")
    public List<Perfume> porCategoria(@PathVariable Long id) {
        return repo.findByCategoriaId(id);
    }

    // POST: crear perfume
    @PostMapping("/crear")
    public ResponseEntity<Perfume> crear(@RequestBody Perfume perfume) {

        if (perfume.getCategoria() == null ||
                perfume.getCategoria().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Long idCategoria = perfume.getCategoria().getId();

        Categoria categoria = categoriaRepo.findById(idCategoria)
                .orElse(null);

        if (categoria == null) {
            return ResponseEntity.badRequest().build();
        }

        perfume.setId(null);
        perfume.setCategoria(categoria);

        return ResponseEntity.ok(repo.save(perfume));
    }

    // PUT: actualizar perfume
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Perfume> actualizar(
            @PathVariable Long id,
            @RequestBody Perfume datos) {

        Perfume perfume = repo.findById(id).orElse(null);

        if (perfume == null) {
            return ResponseEntity.notFound().build();
        }

        if (datos.getCategoria() == null ||
                datos.getCategoria().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Categoria categoria = categoriaRepo
                .findById(datos.getCategoria().getId())
                .orElse(null);

        if (categoria == null) {
            return ResponseEntity.badRequest().build();
        }

        perfume.setNombre(datos.getNombre());
        perfume.setMarca(datos.getMarca());
        perfume.setPrecio(datos.getPrecio());
        perfume.setStock(datos.getStock());
        perfume.setCategoria(categoria);

        return ResponseEntity.ok(repo.save(perfume));
    }

    // DELETE: eliminar perfume
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
