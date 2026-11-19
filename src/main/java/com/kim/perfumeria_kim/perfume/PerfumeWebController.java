
package com.kim.perfumeria_kim.perfume;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PerfumeWebController {

    @GetMapping("/perfumes")
    public String mostrarPerfumes() {
        return "perfumes";
    }
}
