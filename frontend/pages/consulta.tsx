import { useState } from 'react';

export default function Consulta() {
  const [numero, setNumero] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const buscarUltimo = async () => {
    const res = await fetch(`/api/concursos/latest`);
    const data = await res.json();
    if (data && !data.error) setResult([data]);
  };

  const buscarPorNumero = async () => {
    const res = await fetch(`/api/concursos/${numero}`);
    const data = await res.json();
    setResult([data]);
  };

  const buscarPorData = async () => {
    const res = await fetch(`/api/concursos?from=${from}&to=${to}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Consulta de Concursos</h2>
      <div>
        <button onClick={buscarUltimo}>Buscar último (sincroniza Caixa → banco)</button>
      </div>
      <div>
        <input type=\"text\" value={numero} onChange={e => setNumero(e.target.value)} placeholder=\"Número do concurso\" />
        <button onClick={buscarPorNumero}>Buscar por número</button>
      </div>
      <div>
        <input type=\"date\" value={from} onChange={e => setFrom(e.target.value)} />
        <input type=\"date\" value={to} onChange={e => setTo(e.target.value)} />
        <button onClick={buscarPorData}>Buscar por data</button>
      </div>
      <ul>
        {result.map((c: any, idx: number) => (
          <li key={idx}>
            <b>Concurso {c.numero ?? c.numeroDoConcurso}</b> - {c.data_apuracao ?? c.dataApuracao}<br />
            Dezenas: {c.dezenas && c.dezenas.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
