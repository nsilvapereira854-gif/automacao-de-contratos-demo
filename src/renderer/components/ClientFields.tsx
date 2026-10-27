import { MARITAL_STATUSES, type ClientInput } from '../../shared/clients';

interface Props {
  value: ClientInput;
  onChange: (value: ClientInput) => void;
  hideAddress?: boolean;
}

export function ClientFields({ value, onChange, hideAddress = false }: Props) {
  function update(field: keyof ClientInput, text: string) {
    onChange({ ...value, [field]: text });
  }

  const physical = value.tipo_pessoa === 'fisica';
  return (
    <div className="client-fields">
      <label>
        Tipo de pessoa
        <select
          name="tipo_pessoa"
          value={value.tipo_pessoa}
          onChange={(event) => update('tipo_pessoa', event.target.value)}
        >
          <option value="fisica">Pessoa física</option>
          <option value="juridica">Pessoa jurídica</option>
        </select>
      </label>
      <label>
        {physical ? 'Nome completo' : 'Razão social'}
        <input
          name="nome"
          required
          maxLength={200}
          autoComplete="off"
          value={value.nome}
          onChange={(event) => update('nome', event.target.value)}
        />
      </label>
      {physical && (
        <>
          <label>
            Nacionalidade
            <input
              name="nacionalidade"
              required
              maxLength={80}
              value={value.nacionalidade}
              onChange={(event) => update('nacionalidade', event.target.value)}
            />
          </label>
          <label>
            Estado civil
            <select
              name="estado_civil"
              required
              value={value.estado_civil}
              onChange={(event) => update('estado_civil', event.target.value)}
            >
              <option value="">Selecione</option>
              {MARITAL_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <label>
            Nº da identidade — RG (opcional)
            <input
              name="rg"
              maxLength={30}
              value={value.rg}
              onChange={(event) => update('rg', event.target.value)}
            />
          </label>
          <label>
            Nº do CPF
            <input
              name="cpf"
              required
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
              value={value.cpf}
              onChange={(event) => update('cpf', event.target.value)}
            />
          </label>
        </>
      )}
      {!hideAddress && (
        <>
          <label className="full-width">
            Endereço completo
            <input
              name="endereco"
              required
              maxLength={500}
              placeholder="Rua, número, complemento, bairro, cidade e UF"
              value={value.endereco}
              onChange={(event) => update('endereco', event.target.value)}
            />
          </label>
          <label>
            CEP (opcional)
            <input
              name="cep"
              inputMode="numeric"
              maxLength={9}
              placeholder="00000-000"
              value={value.cep}
              onChange={(event) => update('cep', event.target.value)}
            />
          </label>
        </>
      )}
      <label>
        E-mail
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          value={value.email}
          onChange={(event) => update('email', event.target.value)}
        />
      </label>
      <label>
        Nº de telefone com DDD
        <input
          name="telefone"
          type="tel"
          required
          maxLength={25}
          placeholder="(11) 99999-9999"
          value={value.telefone}
          onChange={(event) => update('telefone', event.target.value)}
        />
      </label>
    </div>
  );
}
