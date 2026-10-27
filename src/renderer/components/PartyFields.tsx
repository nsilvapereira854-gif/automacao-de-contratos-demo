import { demoApi } from '../../demo/api';
import { useState } from 'react';
import type { ClientRecord, ContractParty } from '../../shared/contracts';
import { PartyDetailsDialog } from './PartyDetailsDialog';

interface Props {
  role: string;
  value: ContractParty;
  onChange: (person: ContractParty) => void;
}

export function PartyFields({ role, value, onChange }: Props) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState('');
  const [editing, setEditing] = useState(false);
  async function lookup() {
    setBusy(true);
    try {
      const result = await demoApi.listClients(search);
      if (result.success) {
        setClients(result.data);
        setMessage(
          `${result.data.length} cadastro(s) encontrado(s); até 100 resultados.`,
        );
      } else setMessage(result.error.message);
    } catch {
      setMessage('Não foi possível pesquisar os cadastros.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <fieldset>
      <legend>{role}</legend>
      <label>
        A pessoa já tem cadastro?
        <select
          className="registered-client"
          value={registered}
          onChange={(event) => {
            setRegistered(event.target.value);
            if (event.target.value === 'no') setEditing(true);
          }}
        >
          <option value="">Selecione</option>
          <option value="yes">Sim, buscar cadastro</option>
          <option value="no">Não, informar dados pessoais</option>
        </select>
      </label>
      {registered === 'yes' && (
        <div className="client-lookup">
          <label>
            Pesquisar nome
            <input
              value={search}
              maxLength={200}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button
            className="secondary-button"
            type="button"
            disabled={busy}
            onClick={() => void lookup()}
          >
            Buscar cadastros
          </button>
          <p role="status">{message}</p>
          <label>
            Selecionar cadastro
            <select
              className="client-selection"
              value=""
              onChange={(event) => {
                const person = clients.find((client) => client.id === event.target.value);
                if (person) {
                  const next: ContractParty = {
                    ...value,
                    nome: person.nome,
                    tipo_pessoa: person.tipo_pessoa,
                    details: person,
                  };
                  delete next.spouse;
                  onChange(next);
                  setMessage(
                    'Dados copiados. Confira ou complete a identificação antes de continuar.',
                  );
                }
              }}
            >
              <option value="">Selecione para copiar os dados</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome} · {client.tipo_pessoa} · #{client.id}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <p>
        {value.nome
          ? `Pessoa identificada: ${value.nome}`
          : 'Nenhuma pessoa identificada.'}
      </p>
      {value.details && (
        <p>
          {value.details.nacionalidade} · {value.details.estado_civil}
          <br />
          Endereço: {value.details.endereco || 'Não informado'}
        </p>
      )}
      {value.spouse && (
        <p>
          Cônjuge: {value.spouse.details.nome}
          <br />
          {value.spouse.sharedAddress
            ? 'Endereço compartilhado com o titular.'
            : `Endereço: ${value.spouse.details.endereco}`}
        </p>
      )}
      <button type="button" className="secondary-button" onClick={() => setEditing(true)}>
        {value.nome ? 'Conferir dados pessoais e cônjuge' : 'Informar dados pessoais'}
      </button>
      {editing && (
        <PartyDetailsDialog
          party={value}
          onSave={onChange}
          onClose={() => setEditing(false)}
        />
      )}
    </fieldset>
  );
}
