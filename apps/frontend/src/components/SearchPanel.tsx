interface SearchPanelProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchPanel({ value, loading, onChange, onSubmit }: SearchPanelProps) {
  return (
    <section className="panel">
      <p className="eyebrow">Dragon Ball Search</p>
      <h2>Buscá personajes</h2>
      <div className="search-form">
        <input
          data-testid="character-search-input"
          type="search"
          value={value}
          placeholder="Ej: Goku, Vegeta, Piccolo"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSubmit();
            }
          }}
        />
        <button data-testid="character-search-button" type="button" onClick={onSubmit} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </section>
  );
}
