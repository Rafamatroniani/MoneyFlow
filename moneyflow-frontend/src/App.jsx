import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("moneyflowUsuario");

    return usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : null;
  });

  const [mensagem, setMensagem] = useState("");

  const [despesas, setDespesas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");

  const [editandoId, setEditandoId] = useState(null);

  const hoje = new Date();

  const [mesSelecionado, setMesSelecionado] = useState(
    hoje.getMonth()
  );

  const [anoSelecionado, setAnoSelecionado] = useState(
    hoje.getFullYear()
  );

  const fazerLogin = async (event) => {
    event.preventDefault();

    try {
      const resposta = await axios.get(
        "http://localhost:8080/api/usuarios/login",
        {
          params: {
            email: email,
            senha: senha,
          },
        }
      );

      setUsuario(resposta.data);

      localStorage.setItem(
        "moneyflowUsuario",
        JSON.stringify(resposta.data)
      );

      setMensagem("");
    } catch (erro) {
      setMensagem("E-mail ou senha incorretos.");
    }
  };

  const criarConta = async (event) => {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/usuarios",
        {
          nome: nome,
          email: email,
          senha: senha,
        }
      );

      setMensagem("Conta criada com sucesso! 💗");

      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        setModoCadastro(false);
        setMensagem("");
      }, 1500);
    } catch (erro) {
      console.error("Erro ao criar conta:", erro);
      setMensagem("Não foi possível criar a conta.");
    }
  };

  const buscarDespesas = async () => {
    if (!usuario) {
      return;
    }

    try {
      const resposta = await axios.get(
        `http://localhost:8080/api/despesas/usuario/${usuario.id}`
      );

      setDespesas(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar despesas:", erro);
    }
  };

  useEffect(() => {
    buscarDespesas();
  }, [usuario]);

  const limparFormulario = () => {
    setDescricao("");
    setValor("");
    setCategoria("");
    setData("");
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const salvarDespesa = async (event) => {
    event.preventDefault();

    try {
      const dadosDespesa = {
        descricao: descricao,
        valor: Number(valor),
        categoria: categoria,
        data: data,
        usuario: {
          id: usuario.id,
        },
      };

      if (editandoId) {
        await axios.put(
          `http://localhost:8080/api/despesas/${editandoId}`,
          dadosDespesa
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/despesas",
          dadosDespesa
        );
      }

      limparFormulario();
      await buscarDespesas();
    } catch (erro) {
      console.error("Erro ao salvar despesa:", erro);
      alert("Não foi possível salvar a despesa.");
    }
  };

  const editarDespesa = (despesa) => {
    setDescricao(despesa.descricao);
    setValor(despesa.valor);
    setCategoria(despesa.categoria);
    setData(despesa.data);
    setEditandoId(despesa.id);
    setMostrarFormulario(true);
  };

  const excluirDespesa = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta despesa?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/despesas/${id}`
      );

      await buscarDespesas();
    } catch (erro) {
      console.error("Erro ao excluir despesa:", erro);
      alert("Não foi possível excluir a despesa.");
    }
  };

  const sair = () => {
    localStorage.removeItem("moneyflowUsuario");

    setUsuario(null);
    setDespesas([]);
  };

  const despesasDoMes = despesas.filter((despesa) => {
    const dataDespesa = new Date(
      despesa.data + "T00:00:00"
    );

    return (
      dataDespesa.getMonth() === mesSelecionado &&
      dataDespesa.getFullYear() === anoSelecionado
    );
  });

  const totalDoMes = despesasDoMes.reduce(
    (total, despesa) =>
      total + Number(despesa.valor),
    0
  );

  const maiorGasto = despesasDoMes.reduce(
    (maior, despesa) => {
      if (
        !maior ||
        Number(despesa.valor) > Number(maior.valor)
      ) {
        return despesa;
      }

      return maior;
    },
    null
  );

  const formatarValor = (valor) => {
    return Number(valor).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  if (usuario) {
    return (
      <div className="dashboard-page">

        <aside className="sidebar">

          <div className="sidebar-logo">
            🐷

            <span>
              Money<span>Flow</span>
            </span>
          </div>

          <nav>

            <button className="menu-active">
              🏠 Dashboard
            </button>

            <button>
              💸 Despesas
            </button>

            <button>
              📊 Categorias
            </button>

          </nav>

          <button
            className="logout-button"
            onClick={sair}
          >
            ↩ Sair
          </button>

        </aside>

        <main className="dashboard-content">

          <header className="dashboard-header">

            <div>

              <p>
                Olá, {usuario.nome}! 👋
              </p>

              <h1>
                Visão geral das suas finanças
              </h1>

            </div>

            <div className="user-avatar">
              {usuario.nome
                .charAt(0)
                .toUpperCase()}
            </div>

          </header>

          <div className="month-selector">

            <label>
              📅 Período
            </label>

            <select
              value={`${mesSelecionado}-${anoSelecionado}`}
              onChange={(event) => {
                const [mes, ano] =
                  event.target.value.split("-");

                setMesSelecionado(Number(mes));
                setAnoSelecionado(Number(ano));
              }}
            >

              {[
                {
                  mes: hoje.getMonth(),
                  ano: hoje.getFullYear(),
                },
                {
                  mes:
                    hoje.getMonth() === 0
                      ? 11
                      : hoje.getMonth() - 1,
                  ano:
                    hoje.getMonth() === 0
                      ? hoje.getFullYear() - 1
                      : hoje.getFullYear(),
                },
                {
                  mes:
                    hoje.getMonth() === 11
                      ? 0
                      : hoje.getMonth() + 1,
                  ano:
                    hoje.getMonth() === 11
                      ? hoje.getFullYear() + 1
                      : hoje.getFullYear(),
                },
              ].map((periodo, index) => (

                <option
                  key={index}
                  value={`${periodo.mes}-${periodo.ano}`}
                >
                  {meses[periodo.mes]} {periodo.ano}
                </option>

              ))}

            </select>

          </div>

          <section className="summary-cards">

            <div className="summary-card">

              <span>💰</span>

              <p>
                Total gasto
              </p>

              <h2>
                {formatarValor(totalDoMes)}
              </h2>

              <small>
                {meses[mesSelecionado]}{" "}
                {anoSelecionado}
              </small>

            </div>

            <div className="summary-card">

              <span>📅</span>

              <p>
                Despesas
              </p>

              <h2>
                {despesasDoMes.length}
              </h2>

              <small>
                {meses[mesSelecionado]}{" "}
                {anoSelecionado}
              </small>

            </div>

            <div className="summary-card">

              <span>🐷</span>

              <p>
                Maior gasto
              </p>

              <h2>
                {maiorGasto
                  ? formatarValor(maiorGasto.valor)
                  : "R$ 0,00"}
              </h2>

              <small>
                {maiorGasto
                  ? maiorGasto.descricao
                  : "Nenhuma despesa"}
              </small>

            </div>

          </section>

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  Despesas recentes
                </h2>

                <p>
                  Seus gastos de{" "}
                  {meses[
                    mesSelecionado
                  ].toLowerCase()}
                  .
                </p>

              </div>

              <button
                className="new-expense-button"
                onClick={() => {
                  limparFormulario();
                  setMostrarFormulario(true);
                }}
              >
                + Nova despesa
              </button>

            </div>

            {mostrarFormulario && (

              <form
                className="expense-form"
                onSubmit={salvarDespesa}
              >

                <h3>
                  {editandoId
                    ? "Editar despesa"
                    : "Nova despesa"}
                </h3>

                <input
                  type="text"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(event) =>
                    setDescricao(event.target.value)
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Valor"
                  step="0.01"
                  min="0"
                  value={valor}
                  onChange={(event) =>
                    setValor(event.target.value)
                  }
                  required
                />

                <select
                  value={categoria}
                  onChange={(event) =>
                    setCategoria(event.target.value)
                  }
                  required
                >

                  <option value="">
                    Selecione uma categoria
                  </option>

                  <option value="Alimentação">
                    🍔 Alimentação
                  </option>

                  <option value="Compras">
                    🛍️ Compras
                  </option>

                  <option value="Transporte">
                    🚗 Transporte
                  </option>

                  <option value="Beleza">
                    💅 Beleza
                  </option>

                  <option value="Lazer">
                    🎬 Lazer
                  </option>

                  <option value="Casa">
                    🏠 Casa
                  </option>

                  <option value="Outros">
                    📦 Outros
                  </option>

                </select>

                <input
                  type="date"
                  value={data}
                  onChange={(event) =>
                    setData(event.target.value)
                  }
                  required
                />

                <div className="form-buttons">

                  <button
                    type="button"
                    onClick={limparFormulario}
                  >
                    Cancelar
                  </button>

                  <button type="submit">
                    {editandoId
                      ? "Salvar alterações"
                      : "Salvar despesa"}
                  </button>

                </div>

              </form>

            )}

            {despesasDoMes.length === 0 ? (

              <div className="empty-expenses">

                <div>
                  🐷
                </div>

                <h3>
                  Nenhuma despesa neste mês
                </h3>

                <p>
                  Adicione uma despesa ou escolha
                  outro período.
                </p>

              </div>

            ) : (

              <div className="expenses-list">

                {despesasDoMes.map((despesa) => (

                  <div
                    className="expense-item"
                    key={despesa.id}
                  >

                    <div>

                      <strong>
                        {despesa.descricao}
                      </strong>

                      <p>
                        {despesa.categoria} •{" "}
                        {new Date(
                          despesa.data + "T00:00:00"
                        ).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>

                    </div>

                    <div className="expense-actions">

                      <div className="expense-value">
                        {formatarValor(
                          despesa.valor
                        )}
                      </div>

                      <button
                        className="edit-button"
                        onClick={() =>
                          editarDespesa(despesa)
                        }
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          excluirDespesa(despesa.id)
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </main>

      </div>
    );
  }

  if (modoCadastro) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="logo-area">

            <div className="piggy">
              🐷
            </div>

            <h1>
              Money<span>Flow</span>
            </h1>

            <p>
              Crie sua conta e comece a organizar
              suas finanças.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={criarConta}
          >

            <h2>
              Criar conta 💗
            </h2>

            <p className="subtitle">
              Preencha seus dados para começar
            </p>

            <label>
              Nome
            </label>

            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
              required
            />

            <label>
              E-mail
            </label>

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label>
              Senha
            </label>

            <input
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              required
            />

            <label>
              Confirmar senha
            </label>

            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
              required
            />

            <button type="submit">
              Criar conta
            </button>

            {mensagem && (
              <p className="login-message">
                {mensagem}
              </p>
            )}

            <p className="register-text">

              Já tem uma conta?

              <span
                onClick={() => {
                  setModoCadastro(false);
                  setMensagem("");
                }}
              >
                {" "}Voltar para o login
              </span>

            </p>

          </form>

        </div>

      </div>
    );
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo-area">

          <div className="piggy">
            🐷
          </div>

          <h1>
            Money<span>Flow</span>
          </h1>

          <p>
            Controle seus gastos. Entenda seu dinheiro.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={fazerLogin}
        >

          <h2>
            Bem-vinda! 👋
          </h2>

          <p className="subtitle">
            Entre na sua conta para continuar
          </p>

          <label>
            E-mail
          </label>

          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label>
            Senha
          </label>

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(event) =>
              setSenha(event.target.value)
            }
            required
          />

          <button type="submit">
            Entrar
          </button>

          {mensagem && (
            <p className="login-message">
              {mensagem}
            </p>
          )}

          <p className="register-text">

            Ainda não tem uma conta?

            <span
              onClick={() => {
                setModoCadastro(true);
                setMensagem("");
              }}
            >
              {" "}Criar conta
            </span>

          </p>

        </form>

      </div>

    </div>
  );
}

export default App;