const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const filePath = path.join(process.cwd(), 'resultados', 'Lotofácil.xlsx');
console.log('Arquivo:', filePath);
if (!fs.existsSync(filePath)) {
  console.error('Arquivo não encontrado');
  process.exit(1);
}
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

console.log('Planilha:', sheetName);
console.log('Ref:', sheet['!ref']);
console.log('Keys count:', Object.keys(sheet).length);
console.log('Keys sample:', Object.keys(sheet).slice(0, 50));

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
console.log('Total linhas:', rows.length);
for (let i = 0; i < Math.min(rows.length, 20); i++) {
  console.log(i, rows[i]);
}

// Try CSV fallback
const csv = XLSX.utils.sheet_to_csv(sheet);
console.log('CSV preview (first 20 lines):');
console.log(csv.split('\n').slice(0, 20).join('\n'));