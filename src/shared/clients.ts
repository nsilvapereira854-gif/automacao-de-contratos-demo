import type { PersonInput } from './contracts';

export const MARITAL_STATUSES = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'Separado(a)',
  'União estável',
] as const;

export interface ClientDetails {
  nacionalidade: string;
  estado_civil: string;
  rg: string;
  cpf: string;
  endereco: string;
  cep: string;
  email: string;
  telefone: string;
}

export interface ClientInput extends PersonInput, ClientDetails {}

export const EMPTY_CLIENT: ClientInput = {
  nome: '',
  tipo_pessoa: 'fisica',
  nacionalidade: '',
  estado_civil: '',
  rg: '',
  cpf: '',
  endereco: '',
  cep: '',
  email: '',
  telefone: '',
};
