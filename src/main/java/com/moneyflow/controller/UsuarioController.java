package com.moneyflow.controller;

import com.moneyflow.model.Usuario;
import com.moneyflow.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.cadastrar(usuario);
        return ResponseEntity.ok(novoUsuario);
    }

    @GetMapping("/login")
    public ResponseEntity<Usuario> login(
            @RequestParam String email,
            @RequestParam String senha) {

        return usuarioService.buscarPorEmail(email)
                .filter(usuario -> usuario.getSenha().equals(senha))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}