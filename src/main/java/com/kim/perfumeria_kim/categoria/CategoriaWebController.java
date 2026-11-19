package com.kim.perfumeria_kim.categoria;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CategoriaWebController {

    @GetMapping("/categorias")
    public String categorias() {
        return "categorias";
    }
}