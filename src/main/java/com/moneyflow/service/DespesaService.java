package com.moneyflow.service;

import com.moneyflow.model.Despesa;
import com.moneyflow.model.Usuario;
import com.moneyflow.repository.DespesaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DespesaService {

    private final DespesaRepository despesaRepository;

    public DespesaService(DespesaRepository despesaRepository) {
        this.despesaRepository = despesaRepository;
    }

    public Despesa cadastrar(Despesa despesa) {
        return despesaRepository.save(despesa);
    }

    public List<Despesa> listarPorUsuario(Usuario usuario) {
        return despesaRepository.findByUsuario(usuario);
    }

    public List<Despesa> listarPorUsuarioEPeriodo(
            Usuario usuario,
            LocalDate inicio,
            LocalDate fim) {

        return despesaRepository.findByUsuarioAndDataBetween(
                usuario,
                inicio,
                fim
        );
    }

    public Despesa atualizar(Long id, Despesa novaDespesa) {
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow();

        despesa.setDescricao(novaDespesa.getDescricao());
        despesa.setValor(novaDespesa.getValor());
        despesa.setCategoria(novaDespesa.getCategoria());
        despesa.setData(novaDespesa.getData());

        return despesaRepository.save(despesa);
    }

    public void excluir(Long id) {
        despesaRepository.deleteById(id);
    }
}