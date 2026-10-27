import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { NAVIGATION_ITEMS, type PageId } from './navigation';
import { HomePage } from './pages/HomePage';
import { DatabasePage } from './pages/DatabasePage';
import { ClientsPage } from './pages/ClientsPage';
import { ContractPage } from './pages/ContractPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const page = NAVIGATION_ITEMS.find((item) => item.id === currentPage)!;
  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        <header>
          <p className="eyebrow">AUTOMAÇÃO DE CONTRATOS · INTERFACE PÚBLICA</p>
          <h1>{page.label}</h1>
          <p className="notice" role="status">
            Ambiente de demonstração — dados fictícios
          </p>
        </header>
        {currentPage === 'home' ? (
          <HomePage />
        ) : currentPage === 'settings' ? (
          <DatabasePage />
        ) : currentPage === 'clients' ? (
          <ClientsPage />
        ) : currentPage === 'new-contract' ? (
          <ContractPage />
        ) : (
          <section className="card">
            <span className="badge">Indisponível nesta demonstração</span>
            <h2>{page.label}</h2>
            <p>Esta tela preserva a navegação do aplicativo.</p>
            <p>
              Uploads, OCR, IA, modelos internos e integrações externas não fazem parte da
              versão pública.
            </p>
            <button className="primary-button" onClick={() => setCurrentPage('home')}>
              Voltar ao início
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
