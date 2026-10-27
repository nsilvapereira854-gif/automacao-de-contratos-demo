import type { ContractParty } from '../../shared/contracts';
import { PartyFields } from './PartyFields';

interface Props {
  party: ContractParty;
  index: number;
  labels: { first: string; second: string };
  hasRepresentatives: boolean;
  onChange: (party: ContractParty) => void;
}

export function ContractPartyFields({
  party,
  index,
  labels,
  hasRepresentatives,
  onChange,
}: Props) {
  const representative = party.representative;
  return (
    <div className="contract-party">
      <h4>Parte {index + 1}</h4>
      <label>
        Função no contrato
        <select
          value={party.role}
          onChange={(event) =>
            onChange({ ...party, role: event.target.value as ContractParty['role'] })
          }
        >
          <option value="first">{labels.first}</option>
          <option value="second">{labels.second}</option>
        </select>
      </label>
      <PartyFields role={labels[party.role]} value={party} onChange={onChange} />
      {hasRepresentatives && (
        <div className="representation-fields">
          <label>
            Esta parte será representada por alguém?
            <select
              value={representative?.kind ?? 'none'}
              onChange={(event) => {
                if (event.target.value === 'none') {
                  const next = { ...party };
                  delete next.representative;
                  onChange(next);
                } else {
                  onChange({
                    ...party,
                    representative: {
                      nome: representative?.nome ?? '',
                      reference: representative?.reference ?? '',
                      kind: event.target.value as 'procurador' | 'representante',
                    },
                  });
                }
              }}
            >
              <option value="none">Não, participa diretamente</option>
              <option value="procurador">Sim, por procurador</option>
              <option value="representante">Sim, por representante</option>
            </select>
          </label>
          {representative && (
            <>
              <label>
                Nome do procurador ou representante
                <input
                  required
                  maxLength={200}
                  value={representative.nome}
                  onChange={(event) =>
                    onChange({
                      ...party,
                      representative: { ...representative, nome: event.target.value },
                    })
                  }
                />
              </label>
              <label>
                Referência da procuração ou documento de representação
                <input
                  required
                  maxLength={500}
                  value={representative.reference}
                  onChange={(event) =>
                    onChange({
                      ...party,
                      representative: {
                        ...representative,
                        reference: event.target.value,
                      },
                    })
                  }
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
}
