import { useState } from 'react';

export default function Gerador() {
  const [strategy, setStrategy] = useState('top-k');
  const [result, setResult] = useState([]);

  const gerar = async () => {
    const res = await fetch(`/api/gerador?strategy=${strategy}&count=3`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Gerador de Números</h2>
      <select value={strategy} onChange={e => setStrategy(e.target.value)}>
        <option value="top-k">Top-K</option>
        <option value="weighted-random">Weighted Random</option>
        <option value="windowed-hot">Windowed Hot</option>
      </select>
      <button onClick={gerar}>Gerar</button>
      <ul>
        {result.map((r, idx) => (
          <li key={idx}>
            <b>{r.estrategia}:</b> {r.numeros.join(', ')} <br />
            <small>{r.meta.regra}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
