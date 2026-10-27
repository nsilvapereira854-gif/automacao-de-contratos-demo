export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Início', stage: 1 },
  { id: 'new-contract', label: 'Novo contrato', stage: 3 },
  { id: 'import', label: 'Importar documentos', stage: 6 },
  { id: 'clients', label: 'Clientes', stage: 3 },
  { id: 'templates', label: 'Modelos', stage: 4 },
  { id: 'contracts', label: 'Contratos', stage: 11 },
  { id: 'spreadsheets', label: 'Planilhas', stage: 10 },
  { id: 'ai', label: 'IA local', stage: 7 },
  { id: 'settings', label: 'Configurações', stage: 12 },
] as const;

export type PageId = (typeof NAVIGATION_ITEMS)[number]['id'];
