import Link from 'next/link';

export default function Header() {
  return (
    <nav>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/gerador">Gerador</Link></li>
        <li><Link href="/consulta">Consulta</Link></li>
        <li><Link href="/historico">Histórico</Link></li>
        <li><Link href="/precos">Preços</Link></li>
      </ul>
    </nav>
  );
}
