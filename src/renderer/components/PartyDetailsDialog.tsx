import { demoApi } from '../../demo/api';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { EMPTY_CLIENT } from '../../shared/clients';
import type { ContractParty } from '../../shared/contracts';
import { ClientFields } from './ClientFields';

interface Props {
  party: ContractParty;
  onSave: (party: ContractParty) => void;
  onClose: () => void;
}

export function PartyDetailsDialog({ party, onSave, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [details, setDetails] = useState(
    party.details ?? {
      ...EMPTY_CLIENT,
      nome: party.nome,
      tipo_pessoa: party.tipo_pessoa,
    },
  );
  const [includeSpouse, setIncludeSpouse] = useState(Boolean(party.spouse));
  const [spouse, setSpouse] = useState(
    party.spouse?.details ?? { ...EMPTY_CLIENT, estado_civil: 'Casado(a)' },
  );
  const [sharedAddress, setSharedAddress] = useState(party.spouse?.sharedAddress ?? true);
  const [participates, setParticipates] = useState(party.spouse?.participates ?? false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const married =
    details.tipo_pessoa === 'fisica' && details.estado_civil === 'Casado(a)';
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    setBusy(true);
    setMessage('');
    const next: ContractParty = {
      ...party,
      nome: details.nome,
      tipo_pessoa: details.tipo_pessoa,
      details,
    };
    delete next.spouse;
    if (married && includeSpouse)
      next.spouse = { details: spouse, sharedAddress, participates };
    try {
      const result = await demoApi.validateContractParty(next);
      if (!result.success) {
        setMessage(result.error.message);
        return;
      }
      onSave(result.data);
      onClose();
    } catch {
      setMessage('Não foi possível conferir os dados. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }
  return createPortal(
    <dialog
      ref={dialog}
      className="party-dialog"
      aria-labelledby="party-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <h2 id="party-dialog-title">Dados pessoais da parte</h2>
      <p>
        Use somente dados inventados; não transcreva documentos reais. RG e CEP são
        opcionais. As alterações serão usadas neste contrato e não modificam o cadastro de
        clientes.
      </p>
      <form className="database-form clients-form" onSubmit={submit}>
        <fieldset disabled={busy}>
          <ClientFields value={details} onChange={setDetails} />
          {married && (
            <section className="spouse-fields">
              <label>
                Incluir os dados do cônjuge neste mesmo cartão?
                <select
                  className="include-spouse"
                  value={includeSpouse ? 'yes' : 'no'}
                  onChange={(event) => setIncludeSpouse(event.target.value === 'yes')}
                >
                  <option value="no">Não</option>
                  <option value="yes">Sim</option>
                </select>
              </label>
              {includeSpouse && (
                <>
                  <h3>Dados pessoais do cônjuge</h3>
                  <label>
                    O casal compartilha o endereço?
                    <select
                      value={sharedAddress ? 'yes' : 'no'}
                      onChange={(event) => setSharedAddress(event.target.value === 'yes')}
                    >
                      <option value="yes">Sim, usar o endereço acima</option>
                      <option value="no">Não, informar outro endereço</option>
                    </select>
                  </label>
                  <ClientFields
                    value={spouse}
                    onChange={setSpouse}
                    hideAddress={sharedAddress}
                  />
                  <label>
                    O cônjuge também participa como parte no mesmo lado do contrato?
                    <select
                      value={participates ? 'yes' : 'no'}
                      onChange={(event) => setParticipates(event.target.value === 'yes')}
                    >
                      <option value="no">Não, incluir apenas na qualificação</option>
                      <option value="yes">Sim, incluir como parte e na assinatura</option>
                    </select>
                  </label>
                </>
              )}
            </section>
          )}
          <p role="alert">{message}</p>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              {busy ? 'Conferindo…' : 'Usar dados no contrato'}
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>,
    document.body,
  );
}
