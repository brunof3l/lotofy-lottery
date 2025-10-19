const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

function buildRowsFromSheet(sheet) {
  const cellKeys = Object.keys(sheet).filter(k => /^[A-Z]+\d+$/.test(k));
  let maxRow = 0;
  let maxCol = 0;
  const cells = new Map();
  for (const key of cellKeys) {
    const { r, c } = XLSX.utils.decode_cell(key);
    maxRow = Math.max(maxRow, r);
    maxCol = Math.max(maxCol, c);
    const cell = sheet[key];
    const val = cell && 'v' in cell ? cell.v : '';
    cells.set(`${r}:${c}`, val);
  }
  const rows = [];
  for (let r = 0; r <= maxRow; r++) {
    const row = [];
    for (let c = 0; c <= maxCol; c++) {
      const val = cells.get(`${r}:${c}`);
      row.push(val === undefined ? '' : val);
    }
    rows.push(row);
  }
  return rows;
}

function readExcelResults(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  let rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
  if (!rows || rows.length <= 1) {
    rows = buildRowsFromSheet(sheet);
  }

  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i] || [];
    const joined = row.map(v => String(v || '').toLowerCase()).join(' ');
    if (joined.includes('concurso') || joined.includes('data')) {
      headerRowIndex = i;
      break;
    }
  }

  const header = (rows[headerRowIndex] || []).map(v => String(v || '').toLowerCase());
  let contestIdx = header.findIndex(h => h.includes('concurso'));
  let dateIdx = header.findIndex(h => h.includes('data'));

  const results = [];
  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const rawContest = contestIdx >= 0 ? row[contestIdx] : row[0];
    const rawDate = dateIdx >= 0 ? row[dateIdx] : row[1];

    const contest_number = parseInt(String(rawContest).replace(/[^0-9]/g, ''), 10);
    if (!Number.isFinite(contest_number)) continue;

    let draw_date = null;
    if (typeof rawDate === 'number') {
      const date = XLSX.SSF.parse_date_code(rawDate);
      if (date) {
        const jsDate = new Date(Date.UTC(date.y, date.m - 1, date.d));
        draw_date = jsDate.toISOString().slice(0, 10);
      }
    } else if (typeof rawDate === 'string') {
      const parts = rawDate.trim().split(/[\/\-]/);
      if (parts.length >= 3) {
        if (parts[0].length === 4) {
          draw_date = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        } else {
          draw_date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } else {
        draw_date = rawDate;
      }
    }

    const nums = [];
    const seen = new Set();
    for (const cell of row) {
      const n = parseInt(String(cell).trim(), 10);
      if (Number.isFinite(n) && n >= 1 && n <= 25) {
        if (!seen.has(n)) {
          seen.add(n);
          nums.push(n);
        }
      }
    }
    if (nums.length !== 15) {
      continue;
    }
    nums.sort((a, b) => a - b);
    results.push({ contest_number, draw_date, numbers: nums });
  }

  return results;
}

function computeFrequency(results) {
  const freq = Array(26).fill(0);
  for (const r of results) {
    for (const n of r.numbers) freq[n]++;
  }
  return freq.slice(1);
}

function nextContest(results) {
  const max = results.reduce((m, r) => Math.max(m, r.contest_number || 0), 0);
  return max + 1;
}

function pickTopNFromRange(freq, start, end, count, used) {
  const candidates = [];
  for (let n = start; n <= end; n++) {
    candidates.push({ n, f: freq[n - 1] });
  }
  candidates.sort((a, b) => b.f - a.f || a.n - b.n);
  const picked = [];
  for (const c of candidates) {
    if (picked.length >= count) break;
    if (!used.has(c.n)) {
      picked.push(c.n);
      used.add(c.n);
    }
  }
  return picked;
}

function generatePredictions(results) {
  const freq = computeFrequency(results);
  const used = new Set();

  const topAll = freq
    .map((f, i) => ({ n: i + 1, f }))
    .sort((a, b) => b.f - a.f || a.n - b.n)
    .slice(0, 15)
    .map(x => x.n)
    .sort((a, b) => a - b);

  const balanced = [];
  [[1,5],[6,10],[11,15],[16,20],[21,25]].forEach(([s,e]) => {
    const picked = pickTopNFromRange(freq, s, e, 3, used);
    balanced.push(...picked);
  });
  balanced.sort((a, b) => a - b);

  const hot = topAll;

  const random = [];
  const rused = new Set();
  while (random.length < 15) {
    const num = Math.floor(Math.random() * 25) + 1;
    if (!rused.has(num)) {
      rused.add(num);
      random.push(num);
    }
  }
  random.sort((a, b) => a - b);

  return { topAll, balanced, hot, random };
}

function main() {
  try {
    const filePath = path.join(process.cwd(), 'resultados', 'Lotofácil.xlsx');
    const results = readExcelResults(filePath);
    if (results.length === 0) {
      console.log(JSON.stringify({ error: 'Nenhum resultado válido encontrado no Excel (após fallback).' }, null, 2));
      return;
    }
    const next = nextContest(results);
    const preds = generatePredictions(results);

    const output = {
      source: 'Excel resultados/Lotofácil.xlsx',
      contests_parsed: results.length,
      next_contest_number: next,
      predictions: {
        statistical: preds.topAll,
        balanced: preds.balanced,
        hot: preds.hot,
        random: preds.random
      }
    };
    console.log(JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(err);
    console.log(JSON.stringify({ error: err.message }, null, 2));
  }
}

if (require.main === module) {
  main();
}