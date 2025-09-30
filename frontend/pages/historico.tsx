import { useState } from 'react';

const mockHistory = [
  {
    gerado_at: '2025-09-28',
    estrategia: 'top-k',
    numeros: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    meta: { regra: 'top 15 frequentes' }
  },
  {
    gerado_at: '2025-09-27',
    estrategia: 'weighted-random',
    numeros: [2,4,6,8,10,12,14,16,18,20,22,24,1,3,5],
    meta: { regra: 'sorteio ponderado frequência' }
  }
];

export default function Historico() {
  const [history] = useState(mockHistory);

  return (
    <div>
      <h2>Histórico de Gerações</h2>
      <ul>
        {history.map((h, idx) => (
          <li key={idx}>
            <b>{h.gerado_at}</b> - {h.estrategia}<br />
            Números: {h.numeros.join(', ')}<br />
            <small>{h.meta.regra}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
