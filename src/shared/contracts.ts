import type { ClientDetails } from './clients';
import type { ClientInput } from './clients';

export interface PersonInput {
  nome: string;
  tipo_pessoa: 'fisica' | 'juridica';
}

export interface ClientRecord extends PersonInput, ClientDetails {
  id: string;
}

export const DOCUMENT_TYPES = {
  servicos: {
    label: 'Prestação de serviços',
    first: 'Contratante',
    second: 'Contratado',
    objectLabel: 'Descrição dos serviços',
    example: 'Organização de arquivos de demonstração, sem documentos reais.',
  },
  compra_venda: {
    label: 'Compra e venda',
    first: 'Comprador',
    second: 'Vendedor',
    objectLabel: 'Descrição do bem',
    example: 'Compra e venda de uma mesa fictícia para demonstração.',
  },
  locacao: {
    label: 'Locação',
    first: 'Locador',
    second: 'Locatário',
    objectLabel: 'Descrição do bem locado',
    example: 'Locação de equipamento fictício para demonstração.',
  },
  cessao: {
    label: 'Cessão de direitos',
    first: 'Cedente',
    second: 'Cessionário',
    objectLabel: 'Descrição dos direitos cedidos',
    example: 'Cessão onerosa de direitos fictícios, exclusivamente para demonstração.',
  },
} as const;

export function isDocumentType(value: unknown): value is keyof typeof DOCUMENT_TYPES {
  return typeof value === 'string' && Object.hasOwn(DOCUMENT_TYPES, value);
}

export interface ContractInput {
  type: keyof typeof DOCUMENT_TYPES;
  parties: ContractParty[];
  hasRepresentatives: boolean;
  attachments?: string[];
  object: string;
  amount: string;
  date: string;
}

export interface ContractParty extends PersonInput {
  details?: ClientInput;
  spouse?: { details: ClientInput; sharedAddress: boolean; participates: boolean };
  role: 'first' | 'second';
  representative?: {
    kind: 'procurador' | 'representante';
    nome: string;
    reference: string;
  };
}
