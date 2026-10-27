import { demoApi } from '../../demo/api';
import { useEffect, useState, type FormEvent } from 'react';
import type { ClientRecord } from '../../shared/contracts';
import { EMPTY_CLIENT, type ClientInput } from '../../shared/clients';
import { ClientFields } from '../components/ClientFields';
import { ClientSummary } from '../components/ClientSummary';

export function ClientsPage() {
  const [person, setPerson] = useState<ClientInput>(EMPTY_CLIENT);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('Carregando cadastros…');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    demoApi
      .listClients('')
      .then((result) => {
        if (!active) return;
        if (result.success) {
          setClients(result.data);
          setMessage('');
        } else setMessage(result.error.message);
      })
      .catch(() => {
        if (active) setMessage('Não foi possível carregar os cadastros.');
      });
    return () => {
      active = false;
    };
  }, []);

  async function searchClients(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await demoApi.listClients(search);
      if (result.success) {
        setClients(result.data);
        setMessage('Pesquisa concluída.');
      } else setMessage(result.error.message);
    } catch {
      setMessage('Não foi possível pesquisar. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await demoApi.createClient(person);
      if (!result.success) {
        setMessage(result.error.message);
        return;
      }
      setPerson(EMPTY_CLIENT);
      setSearch('');
      setClients([result.data]);
      setMessage('Simulação: cadastro guardado em memória até recarregar a página.');
    } catch {
      setMessage(
        'Não foi possível confirmar o cadastro. Pesquise antes de tentar salvar novamente.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card clients-card">
      <h2>Cadastro de clientes e partes</h2>
      <p>
        Preencha os dados de identificação, endereço e contato. RG e CEP são opcionais.
      </p>
      <p className="notice">Etapa de demonstração: utilize somente dados fictícios.</p>
      <form className="database-form clients-form" onSubmit={save}>
        <fieldset disabled={busy} aria-labelledby="client-form-title">
          <h3 id="client-form-title">Novo cadastro</h3>
          <ClientFields value={person} onChange={setPerson} />
          <div className="form-actions">
            <button className="primary-button" type="submit">
              Salvar cadastro
            </button>
          </div>
        </fieldset>
      </form>
      <p role="status">{message}</p>
      <form className="database-form clients-form client-search" onSubmit={searchClients}>
        <label>
          Pesquisar por nome
          <input
            maxLength={200}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button className="secondary-button" type="submit" disabled={busy}>
          Pesquisar
        </button>
      </form>
      <p>Até 100 resultados. Refine a pesquisa pelo nome.</p>
      {clients.length === 0 ? (
        <p>Nenhum cadastro exibido.</p>
      ) : (
        <ul className="client-list">
          {clients.map((client) => (
            <li key={client.id}>
              <ClientSummary client={client} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
