import { useState } from 'react';

export function DatabasePage() {
  const [message, setMessage] = useState('Simulação local pronta para uso.');
  return (
    <section className="card">
      <span className="badge">Configuração demonstrativa</span>
      <h2>Conexão com os dados de demonstração</h2>
      <p role="status">{message}</p>
      <p>Os cadastros ficam apenas na memória desta aba, até recarregar a página.</p>
      <button
        type="button"
        onClick={() =>
          setMessage('Verificação simulada: exemplos disponíveis em memória.')
        }
      >
        Verificar simulação
      </button>
      <p>
        Não há conexão com PostgreSQL nem configuração de servidores. Esta página não
        solicita senhas e não altera seu computador.
      </p>
    </section>
  );
}
