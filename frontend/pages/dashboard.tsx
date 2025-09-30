import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [freq, setFreq] = useState([]);

  useEffect(() => {
    fetch('/api/estatisticas/frequencia')
      .then(res => res.json())
      .then(setFreq);
  }, []);

  return (
    <div>
      <h2>Dashboard de Estatísticas</h2>
      <table>
        <thead>
          <tr><th>Dezena</th><th>Frequência</th></tr>
        </thead>
        <tbody>
          {freq.map(f => (
            <tr key={f.dezena}>
              <td>{f.dezena}</td>
              <td>{f.frequencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
