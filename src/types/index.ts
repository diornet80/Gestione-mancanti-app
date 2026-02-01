
export enum Department {
  AUTOMATIZZATO = 'AUTOMATIZZATO',
  PANNELLI = 'PANNELLI',
  FINALE = 'FINALE'
}

export enum Action {
  INSERISCI = 'INSERISCI',
  ELIMINA = 'ELIMINA',
  MODIFICA = 'MODIFICA',
  FILTRA = 'FILTRA REPORT',
  IMPORTA = 'IMPORTA REPORT',
  UTENTI = 'GESTIONE UTENTI'
}

export enum Urgency {
  BASSA = 'BASSA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA'
}

export interface InventoryItem {
  id: string;
  msn: string;
  pnl: string;
  part_number: string;
  quantita: number;
  data_masticiatura?: string;
  note?: string;
  tipo?: string;
  urgency: Urgency;
  department: Department;
  created_by: string;
  created_at?: string;
}

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'user' | 'reader';
}

export type ViewState = 'LOGIN' | 'DEPT_SELECT' | 'ACTION_SELECT' | 'CONTENT' | 'DASHBOARD' | 'ADMIN_PANEL' | 'GUIDA' | 'ANALYTICS';
