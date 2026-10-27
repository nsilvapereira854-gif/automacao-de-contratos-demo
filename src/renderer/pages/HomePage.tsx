export function HomePage() {
  return (
    <section className="card">
      <span className="badge">Demonstração pública da interface</span>
      <h2>Uma base para o seu trabalho jurídico</h2>
      <p>Explore os cadastros e o assistente usando somente informações inventadas.</p>
      <div className="summary-grid">
        <article>
          <h3>Simulações disponíveis</h3>
          <p>Busca e cadastro em memória, partes e resumo demonstrativo de contrato.</p>
        </article>
        <article>
          <h3>Sem processamento real</h3>
          <p>Sem banco, autenticação, modelos jurídicos ou exportação Word/PDF.</p>
        </article>
      </div>
      <p className="notice">
        Não informe dados reais. Nenhum formulário envia dados a servidores. Recarregar a
        página restaura os exemplos e apaga as alterações da sessão.
      </p>
    </section>
  );
}
