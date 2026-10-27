import { NAVIGATION_ITEMS, type PageId } from '../navigation';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        AC<span>Automação de Contratos</span>
      </div>
      <nav aria-label="Menu principal">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            aria-current={currentPage === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <p className="sidebar-note">Demonstração · Navegador</p>
    </aside>
  );
}
