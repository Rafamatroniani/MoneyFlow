package com.moneyflow.repository;

import com.moneyflow.model.Despesa;
import com.moneyflow.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUsuario(Usuario usuario);

    List<Despesa> findByUsuarioAndDataBetween(
            Usuario usuario,
            LocalDate inicio,
            LocalDate fim
    );
}