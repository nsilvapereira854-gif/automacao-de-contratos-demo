import type { ClientRecord } from '../../shared/contracts';

export function ClientSummary({ client }: { client: ClientRecord }) {
  const fields = [
    ['Nacionalidade', client.nacionalidade],
    ['Estado civil', client.estado_civil],
    ['RG', client.rg],
    ['CPF', client.cpf],
    ['Endereço', client.endereco],
    ['CEP', client.cep],
    ['E-mail', client.email],
    ['Telefone', client.telefone],
  ];
  return (
    <details className="client-summary">
      <summary>
        <strong>{client.nome}</strong> · Pessoa{' '}
        {client.tipo_pessoa === 'fisica' ? 'física' : 'jurídica'}
      </summary>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || 'Não informado'}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
