import { demoApi } from '../../demo/api';
import { useState } from 'react';
import type { ClientInput } from '../../shared/clients';
import type { ContractParty } from '../../shared/contracts';

interface Props {
  parties: ContractParty[];
  busy: boolean;
  onBusyChange: (busy: boolean) => void;
}

export function SaveContractClients({ parties, busy, onBusyChange }: Props) {
  const people = parties.flatMap((party) => [
    { name: party.nome, details: party.details },
    ...(party.spouse
      ? [
          {
            name: `${party.spouse.details.nome} (cônjuge)`,
            details: {
              ...party.spouse.details,
              ...(party.spouse.sharedAddress && party.details
                ? { endereco: party.details.endereco, cep: party.details.cep }
                : {}),
            },
          },
        ]
      : []),
  ]);
  const [selected, setSelected] = useState(() =>
    people.map((person) => Boolean(person.details)),
  );
  const [message, setMessage] = useState('');
  async function save() {
    const inputs = people.flatMap((person, index): ClientInput[] =>
      selected[index] && person.details ? [person.details] : [],
    );
    if (!inputs.length) return;
    onBusyChange(true);
    setMessage('Salvando cadastros…');
    try {
      const result = await demoApi.saveContractClients(inputs);
      setMessage(
        result.success
          ? `Concluído: ${result.data.saved} cadastro(s) salvo(s); ${result.data.existing} já existente(s), mantido(s) sem alterações. Disponíveis nesta sessão; recarregar a página apaga a simulação.`
          : result.error.message,
      );
    } catch {
      setMessage(
        'Não foi possível confirmar o salvamento. Você pode tentar novamente; cadastros já encontrados não serão duplicados.',
      );
    } finally {
      onBusyChange(false);
    }
  }
  return (
    <section
      className="save-contract-clients"
      aria-labelledby="save-contract-clients-title"
    >
      <h3 id="save-contract-clients-title">Salvar pessoas para próximos contratos</h3>
      <p>
        Selecione as pessoas que deseja guardar como clientes. Cadastros encontrados pelo
        CPF (ou razão social e e-mail para empresas) serão preservados, sem substituir
        seus dados.
      </p>
      <fieldset disabled={busy}>
        <legend>Pessoas do contrato</legend>
        {people.map((person, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={selected[index]}
              disabled={!person.details}
              onChange={(event) =>
                setSelected(
                  selected.map((value, position) =>
                    position === index ? event.target.checked : value,
                  ),
                )
              }
            />
            <span>
              {person.name}
              {!person.details &&
                ' — complete os dados pessoais na etapa Partes para salvar.'}
            </span>
          </label>
        ))}
        <button
          className="secondary-button"
          type="button"
          disabled={!selected.some(Boolean)}
          onClick={() => void save()}
        >
          {busy ? 'Salvando…' : 'Salvar pessoas selecionadas'}
        </button>
      </fieldset>
      <p role="status">{message}</p>
      <p>
        Procuradores e representantes informados apenas pelo nome não são cadastrados por
        esta opção. O texto do contrato não é salvo junto com os clientes.
      </p>
    </section>
  );
}
