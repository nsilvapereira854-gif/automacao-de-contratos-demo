import { EMPTY_CLIENT, type ClientInput } from '../shared/clients';
import {
  DOCUMENT_TYPES,
  type ClientRecord,
  type ContractInput,
  type ContractParty,
} from '../shared/contracts';

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

function ok<T>(data: T): Result<T> {
  return { success: true, data: structuredClone(data) };
}

function fail<T>(message: string): Result<T> {
  return { success: false, error: { code: 'DEMO', message } };
}

// Apenas exemplos inventados. Nada e enviado ou persistido no navegador.
let sequence = 2;
const clients: ClientRecord[] = [
  {
    ...EMPTY_CLIENT,
    id: 'demo-1',
    nome: 'Pessoa Fictícia Alfa',
    tipo_pessoa: 'fisica',
    nacionalidade: 'Brasileira',
    estado_civil: 'Solteiro(a)',
    cpf: '00000000000',
    endereco: 'Rua Imaginária, 0, Cidade Fictícia',
    email: 'alfa@example.invalid',
    telefone: '(00) 00000-0000',
  },
  {
    ...EMPTY_CLIENT,
    id: 'demo-2',
    nome: 'Empresa Fictícia Beta',
    tipo_pessoa: 'juridica',
    endereco: 'Avenida de Exemplo, 0, Cidade Fictícia',
    email: 'beta@example.invalid',
    telefone: '(00) 00000-0000',
  },
];

function add(person: ClientInput): ClientRecord {
  const record = { ...structuredClone(person), id: 'demo-' + ++sequence };
  clients.push(record);
  return record;
}

function hasName(person: ClientInput): boolean {
  return person.nome.trim().length > 0;
}

export const demoApi = {
  async listClients(search: string): Promise<Result<ClientRecord[]>> {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return ok(
      clients
        .filter((person) => person.nome.toLocaleLowerCase('pt-BR').includes(term))
        .slice(0, 100),
    );
  },
  async createClient(person: ClientInput): Promise<Result<ClientRecord>> {
    if (!hasName(person)) return fail('Informe um nome fictício.');
    return ok(add(person));
  },
  async validateContractParty(party: ContractParty): Promise<Result<ContractParty>> {
    if (!party.nome.trim()) return fail('Informe um nome fictício para a parte.');
    if (party.spouse && !hasName(party.spouse.details)) {
      return fail('Informe um nome fictício para o cônjuge.');
    }
    return ok(party);
  },
  async saveContractClients(
    people: ClientInput[],
  ): Promise<Result<{ saved: number; existing: number }>> {
    if (people.some((person) => !hasName(person))) {
      return fail('Informe nomes fictícios para os cadastros selecionados.');
    }
    let saved = 0;
    let existing = 0;
    for (const person of people) {
      const match = clients.some((client) =>
        person.tipo_pessoa === 'fisica'
          ? Boolean(person.cpf) && client.cpf === person.cpf
          : client.nome === person.nome && client.email === person.email,
      );
      if (match) existing++;
      else {
        add(person);
        saved++;
      }
    }
    return ok({ saved, existing });
  },
  async generateContract(input: ContractInput): Promise<Result<string>> {
    if (!input.parties.every((party) => party.nome.trim()) || !input.object.trim()) {
      return fail('Complete as partes e a descrição com dados fictícios.');
    }
    const type = DOCUMENT_TYPES[input.type];
    // Resumo visual novo, sem modelos ou clausulas do aplicativo privado.
    const lines = [
      'SIMULAÇÃO VISUAL — SEM VALIDADE JURÍDICA',
      'Resumo demonstrativo: ' + type.label,
      ...input.parties.flatMap((party) => [
        type[party.role] + ': ' + party.nome,
        ...(party.representative
          ? ['Representante fictício: ' + party.representative.nome]
          : []),
        ...(party.spouse ? ['Cônjuge fictício: ' + party.spouse.details.nome] : []),
      ]),
      'Descrição fictícia: ' + input.object,
      'Valor demonstrativo: R$ ' + input.amount,
      'Data informada: ' + input.date,
      'Não é um contrato pronto. Não há cláusulas, assinatura ou processamento real.',
    ];
    return ok(lines.join('\n\n'));
  },
};
