import { demoApi } from '../../demo/api';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  DOCUMENT_TYPES,
  type ContractInput,
  type ContractParty,
} from '../../shared/contracts';
import { ContractPartyFields } from '../components/ContractPartyFields';
import { PropertyAttachments } from '../components/PropertyAttachments';
import { SaveContractClients } from '../components/SaveContractClients';

const INITIAL: ContractInput = {
  type: 'servicos',
  parties: [
    { nome: '', tipo_pessoa: 'fisica', role: 'first' },
    { nome: '', tipo_pessoa: 'juridica', role: 'second' },
  ],
  hasRepresentatives: false,
  object: '',
  amount: '',
  date: '',
};

const STEPS = ['Documento', 'Partes', 'Dados', 'Prévia'];

export function ContractPage() {
  const [input, setInput] = useState<ContractInput>(INITIAL);
  const [step, setStep] = useState(1);
  const [visitedStep, setVisitedStep] = useState(1);
  const heading = useRef<HTMLHeadingElement>(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const type = DOCUMENT_TYPES[input.type];

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'start' });
  }, [step]);

  function navigateTo(target: number) {
    if (busy || target > visitedStep || target === 4) return;
    setPreview('');
    setMessage('');
    setStep(target);
  }

  function updateParty(index: number, person: ContractParty) {
    const parties: ContractInput['parties'] = [...input.parties];
    parties[index] = person;
    setInput({ ...input, parties });
  }

  async function advance(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    if (step === 2 && input.parties.some((party) => !party.nome.trim())) {
      setMessage('Busque um cadastro ou informe os dados pessoais de cada parte.');
      return;
    }
    if (
      step === 2 &&
      input.hasRepresentatives &&
      !input.parties.some((party) => party.representative)
    ) {
      setMessage(
        'Indique o procurador ou representante de pelo menos uma parte, ou altere a resposta no passo anterior.',
      );
      return;
    }
    if (step < 3) {
      setVisitedStep((previous) => Math.max(previous, step + 1));
      setStep(step + 1);
      return;
    }
    setBusy(true);
    try {
      const result = await demoApi.generateContract({
        ...input,
      });
      if (result.success) {
        setPreview(result.data);
        setStep(4);
      } else setMessage(result.error.message);
    } catch {
      setMessage('Não foi possível gerar a prévia. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  function example() {
    setInput({
      type: input.type,
      parties: input.parties.map((party, index) => ({
        role: party.role,
        tipo_pessoa: party.tipo_pessoa,
        nome:
          index === 0
            ? 'Cliente Exemplo Fictício'
            : index === 1
              ? 'Empresa Demonstração Fictícia'
              : `Parte Fictícia ${index + 1}`,
        ...(input.hasRepresentatives && index === 0
          ? {
              representative: {
                kind: 'procurador' as const,
                nome: 'Procurador Fictício',
                reference: 'Procuração fictícia de demonstração',
              },
            }
          : {}),
      })),
      hasRepresentatives: input.hasRepresentatives,
      object: type.example,
      amount: '1500,00',
      date: '2026-10-15',
    });
    setMessage('Exemplo preenchido. Confira as partes e os dados antes de gerar.');
  }

  return (
    <section className="card contract-card">
      <h2 ref={heading} tabIndex={-1}>
        Assistente de contrato
      </h2>
      <p className="notice">
        Use dados fictícios. A prévia é demonstrativa e permanece apenas nesta tela. Esta
        versão pública não processa contratos reais nem exporta documentos.
      </p>
      <p>
        Passo {step} de 4 · {STEPS[step - 1]}
      </p>
      <ol className="contract-steps" aria-label="Etapas do contrato">
        {STEPS.map((label, index) => {
          const target = index + 1;
          return (
            <li key={label}>
              <button
                type="button"
                aria-current={step === target ? 'step' : undefined}
                disabled={busy || (target === 4 ? step !== 4 : target > visitedStep)}
                onClick={() => navigateTo(target)}
              >
                <span>{target}</span> {label}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="step-navigation-hint">
        Você pode retornar às etapas já visitadas sem perder os dados fictícios deste
        contrato.
      </p>
      {step === 4 ? (
        <>
          <pre className="contract-preview">{preview}</pre>
          <SaveContractClients
            parties={input.parties}
            busy={busy}
            onBusyChange={setBusy}
          />
          <div className="form-actions">
            <button
              className="secondary-button"
              type="button"
              disabled={busy}
              onClick={() => navigateTo(3)}
            >
              Voltar e editar
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={busy}
              onClick={() => {
                setInput(INITIAL);

                setPreview('');
                setStep(1);
                setVisitedStep(1);
                setMessage('');
              }}
            >
              Criar outro contrato
            </button>
          </div>
        </>
      ) : (
        <form className="database-form contract-form" onSubmit={advance}>
          <fieldset disabled={busy} aria-labelledby="contract-step-title">
            <h3 id="contract-step-title" className="step-title">
              {
                ['Escolha o documento', 'Identifique as partes', 'Informe as condições'][
                  step - 1
                ]
              }
            </h3>
            {step === 1 && (
              <>
                <label>
                  Tipo de documento
                  <select
                    value={input.type}
                    onChange={(event) =>
                      setInput({
                        ...input,
                        type: event.target.value as ContractInput['type'],
                      })
                    }
                  >
                    {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="field-hint">
                  Partes deste documento: {type.first} e {type.second}.
                </p>
                <label>
                  Quantas partes terá o contrato?
                  <select
                    value={input.parties.length}
                    name="party-count"
                    onChange={(event) => {
                      const count = Number(event.target.value);
                      setInput({
                        ...input,
                        parties: Array.from(
                          { length: count },
                          (_, index) =>
                            input.parties[index] ?? {
                              nome: '',
                              tipo_pessoa: 'fisica',
                              role: 'second',
                            },
                        ),
                      });
                    }}
                  >
                    {Array.from({ length: 19 }, (_, index) => index + 2).map((count) => (
                      <option key={count} value={count}>
                        {count} partes
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Haverá procurador ou representante?
                  <select
                    value={input.hasRepresentatives ? 'yes' : 'no'}
                    name="has-representatives"
                    onChange={(event) => {
                      const hasRepresentatives = event.target.value === 'yes';
                      setInput({
                        ...input,
                        hasRepresentatives,
                        parties: input.parties.map((party) => {
                          if (hasRepresentatives) return party;
                          const next = { ...party };
                          delete next.representative;
                          return next;
                        }),
                      });
                    }}
                  >
                    <option value="no">Não</option>
                    <option value="yes">Sim</option>
                  </select>
                </label>
                <p className="field-hint">
                  Cada cartão pode agrupar uma pessoa e seu cônjuge. Procuradores e
                  representantes serão vinculados às partes no próximo passo.
                </p>
                <div className="example-panel">
                  <p>
                    Quer experimentar? Preencha um exemplo de{' '}
                    {type.label.toLocaleLowerCase('pt-BR')} e confira os próximos passos.
                  </p>
                  <button className="secondary-button" type="button" onClick={example}>
                    Preencher exemplo fictício
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                {input.parties.map((party, index) => (
                  <ContractPartyFields
                    key={index}
                    party={party}
                    index={index}
                    labels={type}
                    hasRepresentatives={input.hasRepresentatives}
                    onChange={(person) => updateParty(index, person)}
                  />
                ))}
              </>
            )}
            {step === 3 && (
              <>
                <ul>
                  {input.parties.map((party, index) => (
                    <li key={index}>
                      {type[party.role]}: {party.nome}
                      {party.representative
                        ? ` — ${party.representative.kind}: ${party.representative.nome}`
                        : ''}
                    </li>
                  ))}
                </ul>
                <PropertyAttachments />
                <label>
                  {type.objectLabel}
                  <textarea
                    required
                    maxLength={3000}
                    rows={5}
                    value={input.object}
                    onChange={(event) =>
                      setInput({ ...input, object: event.target.value })
                    }
                  />
                </label>
                <label>
                  Valor em reais (ex.: 1500,00)
                  <input
                    required
                    inputMode="decimal"
                    maxLength={12}
                    pattern="[0-9]+,[0-9]{2}"
                    value={input.amount}
                    onChange={(event) =>
                      setInput({ ...input, amount: event.target.value })
                    }
                  />
                </label>
                <label>
                  Data
                  <input
                    type="date"
                    required
                    min="1900-01-01"
                    max="2199-12-31"
                    value={input.date}
                    onChange={(event) => setInput({ ...input, date: event.target.value })}
                  />
                </label>
              </>
            )}
            <div className="form-actions">
              {step > 1 && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => navigateTo(step - 1)}
                >
                  Voltar à etapa anterior
                </button>
              )}
              <button className="primary-button" type="submit">
                {busy ? 'Gerando…' : step === 3 ? 'Gerar prévia' : 'Continuar'}
              </button>
            </div>
          </fieldset>
        </form>
      )}
      <p role="status">{message}</p>
    </section>
  );
}
