import type { PersonInput } from '../../shared/contracts';

interface Props {
  value: PersonInput;
  onChange: (value: PersonInput) => void;
}

export function PersonFields({ value, onChange }: Props) {
  return (
    <>
      <label>
        Tipo de pessoa
        <select
          value={value.tipo_pessoa}
          onChange={(event) =>
            onChange({
              ...value,
              tipo_pessoa: event.target.value as PersonInput['tipo_pessoa'],
            })
          }
        >
          <option value="fisica">Pessoa física</option>
          <option value="juridica">Pessoa jurídica</option>
        </select>
      </label>
      <label>
        Nome ou razão social
        <input
          required
          maxLength={200}
          value={value.nome}
          onChange={(event) => onChange({ ...value, nome: event.target.value })}
        />
      </label>
    </>
  );
}
