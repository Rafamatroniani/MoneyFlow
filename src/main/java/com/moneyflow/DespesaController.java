package com.moneyflow.controller;

import com.moneyflow.model.Despesa;
import com.moneyflow.model.Usuario;
import com.moneyflow.service.DespesaService;
import com.moneyflow.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/despesas")
public class DespesaController {

    private final DespesaService despesaService;
    private final UsuarioService usuarioService;

    public DespesaController(
            DespesaService despesaService,
            UsuarioService usuarioService) {
        this.despesaService = despesaService;
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Despesa> cadastrar(
            @RequestBody Despesa despesa) {

        return ResponseEntity.ok(
                despesaService.cadastrar(despesa)
        );
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Despesa>> listar(
            @PathVariable Long usuarioId) {

        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        return ResponseEntity.ok(
                despesaService.listarPorUsuario(usuario)
        );
    }

    @GetMapping("/usuario/{usuarioId}/periodo")
    public ResponseEntity<List<Despesa>> listarPorPeriodo(
            @PathVariable Long usuarioId,
            @RequestParam LocalDate inicio,
            @RequestParam LocalDate fim) {

        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        return ResponseEntity.ok(
                despesaService.listarPorUsuarioEPeriodo(
                        usuario,
                        inicio,
                        fim
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizar(
            @PathVariable Long id,
            @RequestBody Despesa despesa) {

        return ResponseEntity.ok(
                despesaService.atualizar(id, despesa)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        despesaService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}