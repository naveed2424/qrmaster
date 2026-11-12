import { useState, useEffect, useRef, useMemo, useId } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Printer,
  Trash2,
  Plus,
  Search,
  Check,
  AlertCircle,
  Palette,
  Layers,
  Image as ImageIcon,
  X,
  Grid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { QRCustomization, SupportedLanguage } from '../types/qr';
import {
  parseCsv,
  inferColumnMapping,
  buildRowPayload,
  sanitizeFilename,
  BATCH_TEMPLATES,
  BatchColumnMapping,
  BatchPayloadMode,
} from '../utils/csvParser';
import {
  renderQRToCanvas,
  renderQRToBlob,
  generateQRSvgString,
  exportHighResCanvas,
  downloadCanvasAsSvg,
  PRESET_LOGOS,
} from '../utils/qrCanvas';

interface BatchQRGeneratorProps {
  currentLang: SupportedLanguage;
  customization: QRCustomization;
  onCustomizationChange: (newSettings: QRCustomization) => void;
}

interface BatchItem {
  id: string;
  index: number;
  label: string;
  payload: string;
  rowCustomization: QRCustomization;
  rawRow: Record<string, string>;
  isValid: boolean;
}

function BatchQRThumbnail({
  payload,
  customization,
  className = 'w-32 h-32',
}: {
  payload: string;
  customization: QRCustomization;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const animId = requestAnimationFrame(() => {
      if (cancelled || !canvasRef.current) return;
      renderQRToCanvas(canvasRef.current, payload || 'https://2qrcode.com', customization, false);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [payload, customization]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className} object-contain rounded-lg transition-transform duration-150`}
    />
  );
}

export default function BatchQRGenerator({
  customization,
  onCustomizationChange,
}: BatchQRGeneratorProps) {
  const fileInputId = useId();
  const logoUploadRef = useRef<HTMLInputElement | null>(null);

  const [rawCsvText, setRawCsvText] = useState<string>(BATCH_TEMPLATES[0].csv);
  const [sourceFilename, setSourceFilename] = useState<string>('2qrcode-template-urls.csv');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    try {
      const res = parseCsv(rawCsvText);
      return res;
    } catch {
      return { headers: [], rows: [], delimiter: ',' };
    }
  }, [rawCsvText]);

  const [mapping, setMapping] = useState<BatchColumnMapping>(() =>
    inferColumnMapping(parseCsv(BATCH_TEMPLATES[0].csv).headers)
  );

  // Override rows locally if user adds/edits/removes rows manually
  const [customRows, setCustomRows] = useState<Record<string, string>[]>(() =>
    parseCsv(BATCH_TEMPLATES[0].csv).rows
  );

  // Sync customRows and inferred mapping whenever CSV source text changes
  const applyCsvSource = (text: string, filename: string) => {
    const result = parseCsv(text);
    if (result.headers.length === 0 || result.rows.length === 0) {
      setParseError('No valid data rows found in CSV. Ensure row 1 contains headers and rows below contain data.');
    } else {
      setParseError(null);
    }
    setRawCsvText(text);
    setSourceFilename(filename);
    setCustomRows(result.rows);
    setMapping(inferColumnMapping(result.headers));
    setCurrentPage(1);
  };

  // Style controls tab
  const [styleTab, setStyleTab] = useState<'style' | 'logo' | 'frame'>('style');
  const [useCsvCtaColumn, setUseCsvCtaColumn] = useState<boolean>(true);

  // Batch preview view & export controls
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterQuery, setFilterQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'jpg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ done: 0, total: 0 });
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Print sheet state
  const [printItems, setPrintItems] = useState<{ label: string; dataUrl: string }[]>([]);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  const itemsPerPage = viewMode === 'grid' ? 12 : 25;

  const updateStyle = (patch: Partial<QRCustomization>) => {
    onCustomizationChange({ ...customization, ...patch });
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      applyCsvSource(content, file.name);
    };
    reader.onerror = () => {
      setParseError('Could not read the selected file. Please upload a UTF-8 .csv or .txt file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDownloadSampleCsv = (preset: (typeof BATCH_TEMPLATES)[number]) => {
    const blob = new Blob([preset.csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = preset.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateStyle({
        customLogoUrl: String(ev.target?.result || ''),
        logoPreset: null,
        errorCorrection: 'H',
      });
    };
    reader.readAsDataURL(file);
  };

  // Build standardized items from rows + mapping + unified customization
  const batchItems: BatchItem[] = useMemo(() => {
    return customRows.map((row, idx) => {
      const label = (row[mapping.labelColumn] || `QR-${idx + 1}`).trim();
      const payload = buildRowPayload(row, mapping);
      const rowCta =
        useCsvCtaColumn && mapping.ctaColumn && row[mapping.ctaColumn]
          ? row[mapping.ctaColumn].trim()
          : customization.frameText;

      return {
        id: `batch-row-${idx}`,
        index: idx,
        label,
        payload,
        rowCustomization: {
          ...customization,
          frameText: rowCta || customization.frameText,
        },
        rawRow: row,
        isValid: payload.length > 0,
      };
    });
  }, [customRows, mapping, customization, useCsvCtaColumn]);

  const validItems = useMemo(() => batchItems.filter((item) => item.isValid), [batchItems]);

  const filteredItems = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return batchItems;
    return batchItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.payload.toLowerCase().includes(q)
    );
  }, [batchItems, filterQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, safePage, itemsPerPage]);

  const handleDeleteRow = (rowIndex: number) => {
    setCustomRows((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  const handleUpdateRowCell = (rowIndex: number, key: string, value: string) => {
    setCustomRows((prev) =>
      prev.map((row, idx) => (idx === rowIndex ? { ...row, [key]: value } : row))
    );
  };

  const handleAddBlankRow = () => {
    const headers = parsed.headers.length > 0 ? parsed.headers : ['label', 'url'];
    const blank: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (i === 0) blank[h] = `Item-${customRows.length + 1}`;
      else if (/url|link/i.test(h)) blank[h] = 'https://2qrcode.com/';
      else blank[h] = '';
    });
    setCustomRows((prev) => [...prev, blank]);
  };

  const handleDownloadSingle = async (item: BatchItem, fmt: 'png' | 'svg' | 'jpg') => {
    const baseName = sanitizeFilename(item.label, item.index);
    if (fmt === 'svg') {
      await downloadCanvasAsSvg(item.payload, item.rowCustomization, `${baseName}.svg`);
    } else {
      await exportHighResCanvas(item.payload, item.rowCustomization, fmt, `${baseName}.${fmt}`);
    }
  };

  const handleDownloadZip = async () => {
    if (validItems.length === 0 || isExporting) return;
    setIsExporting(true);
    setExportMessage(null);
    setExportProgress({ done: 0, total: validItems.length });

    try {
      const zip = new JSZip();
      const folder = zip.folder(`2qrcode-batch-${exportFormat}`) || zip;

      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        const filename = sanitizeFilename(item.label, item.index);

        if (exportFormat === 'svg') {
          const svgStr = await generateQRSvgString(item.payload, item.rowCustomization);
          folder.file(`${filename}.svg`, svgStr);
        } else {
          const blob = await renderQRToBlob(item.payload, item.rowCustomization, exportFormat);
          folder.file(`${filename}.${exportFormat}`, blob);
        }

        setExportProgress({ done: i + 1, total: validItems.length });

        // Yield briefly every 10 items so browser UI stays responsive
        if (i % 10 === 9) {
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      // Include a manifest CSV mapping filenames to payloads
      const manifestLines = [
        'filename,label,payload',
        ...validItems.map((it) => {
          const fname = `${sanitizeFilename(it.label, it.index)}.${exportFormat}`;
          const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
          return `${esc(fname)},${esc(it.label)},${esc(it.payload)}`;
        }),
      ];
      zip.file('batch-manifest.csv', manifestLines.join('\n'));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `2qrcode-batch-${exportFormat}-${validItems.length}-codes.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      setExportMessage(`Exported ${validItems.length} ${exportFormat.toUpperCase()} QR codes in ZIP.`);

      try {
        confetti({
          particleCount: 60,
          spread: 75,
          origin: { y: 0.8 },
          colors: ['#fbbf24', '#f59e0b', '#fef08a', '#ffffff'],
        });
      } catch {
        // Ignore confetti errors
      }
    } catch {
      setExportMessage('Failed to build ZIP bundle. Please verify your CSV payloads.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintSheet = async () => {
    if (validItems.length === 0 || isPreparingPrint) return;
    setIsPreparingPrint(true);
    try {
      const limit = Math.min(validItems.length, 60);
      const generated: { label: string; dataUrl: string }[] = [];
      const canvas = document.createElement('canvas');

      for (let i = 0; i < limit; i++) {
        const item = validItems[i];
        await renderQRToCanvas(canvas, item.payload, item.rowCustomization, false);
        generated.push({
          label: item.label,
          dataUrl: canvas.toDataURL('image/png'),
        });
      }

      setPrintItems(generated);
      setTimeout(() => {
        window.print();
        setIsPreparingPrint(false);
      }, 150);
    } catch {
      setIsPreparingPrint(false);
    }
  };

  const referenceItem = validItems[0] || {
    label: 'Preview',
    payload: 'https://2qrcode.com',
    rowCustomization: customization,
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 space-y-10 no-print">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2.5 max-w-3xl">
            <div className="text-xs font-semibold text-amber-400 tracking-wide">
              2qrcode.com · Bulk Operations &amp; Spreadsheet Automation
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
              Batch CSV <span className="text-gold-gradient">QR Code Generator</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Upload any CSV or paste spreadsheet rows to generate dozens or hundreds of standardized QR codes in seconds. Lock in your brand colors, dot pattern, logo, and frame CTA once, then download everything in a single ZIP archive.
            </p>
          </div>

          {/* Summary Metrics Strip */}
          <div className="flex items-center gap-6 px-5 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl shrink-0">
            <div>
              <div className="text-[11px] text-zinc-400">Parsed Rows</div>
              <div className="text-xl font-bold font-mono tabular-nums text-white">
                {batchItems.length}
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <div className="text-[11px] text-zinc-400">Ready Codes</div>
              <div className="text-xl font-bold font-mono tabular-nums text-amber-400">
                {validItems.length}
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <div className="text-[11px] text-zinc-400">Export Size</div>
              <div className="text-xl font-bold font-mono tabular-nums text-zinc-200">
                {customization.size}px
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Split: CSV & Column Config (Left) + Standardized Style & Reference (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Step 1 & 2 — CSV Upload + Column Mapping (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* CSV Source Panel */}
            <div className="p-6 bg-zinc-950/95 border border-zinc-800 rounded-3xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <span>01. Import CSV Data Source</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Active file: <span className="font-mono text-zinc-200">{sourceFilename}</span>
                  </p>
                </div>

                {/* Upload vs Paste Switcher */}
                <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl shrink-0">
                  <button
                    onClick={() => setInputMode('upload')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      inputMode === 'upload'
                        ? 'bg-amber-400 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Upload CSV File
                  </button>
                  <button
                    onClick={() => setInputMode('paste')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      inputMode === 'paste'
                        ? 'bg-amber-400 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Paste / Edit CSV
                  </button>
                </div>
              </div>

              {inputMode === 'upload' ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`p-7 border-2 border-dashed rounded-2xl text-center space-y-3 transition-colors ${
                    isDragging
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-zinc-800 bg-black/40 hover:border-amber-500/40'
                  }`}
                >
                  <input
                    id={fileInputId}
                    type="file"
                    accept=".csv,.tsv,.txt,text/csv"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                    }}
                    className="hidden"
                  />
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">
                      Drag and drop your CSV file here
                    </div>
                    <p className="text-xs text-zinc-400">
                      Supports comma, semicolon, or tab-separated spreadsheets exported from Excel or Google Sheets.
                    </p>
                  </div>
                  <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
                    <label
                      htmlFor={fileInputId}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs rounded-xl cursor-pointer whitespace-nowrap shrink-0 hover:from-amber-300 hover:to-yellow-400 transition-all"
                    >
                      Select CSV File
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <textarea
                    value={rawCsvText}
                    onChange={(e) => applyCsvSource(e.target.value, 'pasted-batch.csv')}
                    rows={7}
                    spellCheck={false}
                    placeholder="label,url,cta_text&#10;Table-01,https://2qrcode.com/?table=1,VIEW MENU"
                    className="w-full p-3.5 bg-black border border-zinc-800 focus:border-amber-400 rounded-xl font-mono text-xs text-zinc-200 focus:outline-hidden leading-relaxed"
                  />
                  <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>First line is treated as column headers. Changes apply live.</span>
                    <button
                      onClick={() => applyCsvSource('', 'empty.csv')}
                      className="text-zinc-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Clear Editor
                    </button>
                  </div>
                </div>
              )}

              {parseError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Ready-to-Use CSV Templates */}
              <div className="pt-2 space-y-2.5">
                <div className="text-xs font-bold text-zinc-300">
                  Load or download a ready-to-use CSV template:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BATCH_TEMPLATES.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl flex items-center justify-between gap-2"
                    >
                      <button
                        onClick={() => applyCsvSource(preset.csv, preset.filename)}
                        className="text-left min-w-0 flex-1 cursor-pointer group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {preset.description}
                        </div>
                      </button>
                      <button
                        onClick={() => handleDownloadSampleCsv(preset)}
                        title={`Download ${preset.filename}`}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40 shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Column Mapping & Payload Builder */}
            <div className="p-6 bg-zinc-950/95 border border-zinc-800 rounded-3xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    <span>02. Map CSV Columns to QR Payload</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Detected columns: {parsed.headers.length > 0 ? parsed.headers.join(', ') : 'None'}
                  </p>
                </div>

                {/* Format Mode Segmented Buttons */}
                <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
                  {(
                    [
                      { id: 'direct', label: 'Direct Column' },
                      { id: 'url-template', label: 'URL Template' },
                      { id: 'wifi', label: 'Wi-Fi' },
                      { id: 'vcard', label: 'vCard 3.0' },
                    ] as { id: BatchPayloadMode; label: string }[]
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMapping((prev) => ({ ...prev, mode: m.id }))}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        mapping.mode === m.id
                          ? 'bg-amber-400 text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Label + Frame CTA Column Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Filename / Label Column
                  </label>
                  <select
                    value={mapping.labelColumn}
                    onChange={(e) => setMapping((prev) => ({ ...prev, labelColumn: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="">Auto-number (001, 002...)</option>
                    {parsed.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Per-Row CTA Banner Column
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useCsvCtaColumn}
                        onChange={(e) => setUseCsvCtaColumn(e.target.checked)}
                        className="accent-amber-400"
                      />
                      <span>Use CSV column</span>
                    </label>
                  </div>
                  <select
                    disabled={!useCsvCtaColumn}
                    value={mapping.ctaColumn}
                    onChange={(e) => setMapping((prev) => ({ ...prev, ctaColumn: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium text-white focus:outline-hidden focus:border-amber-400 disabled:opacity-40"
                  >
                    <option value="">Use standardized frame CTA ({customization.frameText})</option>
                    {parsed.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode-Specific Column Selectors */}
              {mapping.mode === 'direct' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    QR Content / URL Column
                  </label>
                  <select
                    value={mapping.contentColumn}
                    onChange={(e) => setMapping((prev) => ({ ...prev, contentColumn: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium text-white focus:outline-hidden focus:border-amber-400"
                  >
                    {parsed.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {mapping.mode === 'url-template' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Dynamic Payload Pattern (insert CSV columns using {'{{column_name}}'})
                  </label>
                  <input
                    type="text"
                    value={mapping.urlTemplate}
                    onChange={(e) => setMapping((prev) => ({ ...prev, urlTemplate: e.target.value }))}
                    placeholder="https://2qrcode.com/item/{{sku}}"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl font-mono text-xs text-amber-300 focus:outline-hidden"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {parsed.headers.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() =>
                          setMapping((prev) => ({
                            ...prev,
                            urlTemplate: `${prev.urlTemplate}{{${h}}}`,
                          }))
                        }
                        className="px-2 py-1 text-[11px] font-mono rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-amber-400 hover:text-amber-300 cursor-pointer"
                      >
                        + {`{{${h}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mapping.mode === 'wifi' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Network SSID</label>
                    <select
                      value={mapping.wifiSsidColumn}
                      onChange={(e) => setMapping((prev) => ({ ...prev, wifiSsidColumn: e.target.value }))}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    >
                      {parsed.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
                    <select
                      value={mapping.wifiPasswordColumn}
                      onChange={(e) => setMapping((prev) => ({ ...prev, wifiPasswordColumn: e.target.value }))}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    >
                      <option value="">None / Open</option>
                      {parsed.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Security (WPA/WEP)</label>
                    <select
                      value={mapping.wifiEncryptionColumn}
                      onChange={(e) => setMapping((prev) => ({ ...prev, wifiEncryptionColumn: e.target.value }))}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    >
                      <option value="">Default WPA/WPA2</option>
                      {parsed.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {mapping.mode === 'vcard' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'vcardFirstNameColumn', label: 'First Name' },
                    { key: 'vcardLastNameColumn', label: 'Last Name' },
                    { key: 'vcardPhoneColumn', label: 'Phone' },
                    { key: 'vcardEmailColumn', label: 'Email' },
                    { key: 'vcardCompanyColumn', label: 'Company' },
                    { key: 'vcardTitleColumn', label: 'Job Title' },
                    { key: 'vcardUrlColumn', label: 'Website URL' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                        {field.label}
                      </label>
                      <select
                        value={(mapping as any)[field.key]}
                        onChange={(e) =>
                          setMapping((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                      >
                        <option value="">Unmapped</option>
                        {parsed.headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Step 3 — Standardized Custom Styles & Live Reference Card (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-zinc-950/95 border border-amber-500/25 rounded-3xl space-y-5">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>03. Standardized Batch Style</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Applies identically across all {validItems.length} QR codes
                </p>
              </div>
            </div>

            {/* Live Reference Preview */}
            <div className="p-4 bg-black/70 border border-zinc-800 rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0">
                <BatchQRThumbnail
                  payload={referenceItem.payload}
                  customization={referenceItem.rowCustomization}
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-[11px] font-semibold text-amber-400">
                  Live Batch Reference Preview
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {referenceItem.label}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  {referenceItem.payload}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono tabular-nums pt-1">
                  {customization.dotStyle} · ECC {customization.errorCorrection} · {customization.size}px
                </div>
              </div>
            </div>

            {/* Compact Style Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {[
                { id: 'style', label: 'Colors & Dots', icon: Palette },
                { id: 'logo', label: 'Brand Logo', icon: ImageIcon },
                { id: 'frame', label: 'Frame & Size', icon: Layers },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setStyleTab(t.id as any)}
                  className={`flex-1 py-2 px-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    styleTab === t.id
                      ? 'bg-amber-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {styleTab === 'style' && (
              <div className="space-y-4">
                {/* Quick Color Palettes */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Imperial Gold', fg: '#facc15', bg: '#000000', grad: '#ca8a04' },
                    { name: 'Classic Ink', fg: '#0f172a', bg: '#ffffff', grad: '#334155' },
                    { name: 'Emerald Dark', fg: '#10b981', bg: '#050505', grad: '#047857' },
                    { name: 'Amber Print', fg: '#b45309', bg: '#ffffff', grad: '#78350f' },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        updateStyle({
                          fgColor: p.fg,
                          bgColor: p.bg,
                          gradientColor2: p.grad,
                          eyeFrameColor: p.fg,
                          eyeBallColor: p.fg,
                          frameColor: p.fg,
                          frameTextColor: p.bg === '#ffffff' ? '#ffffff' : '#000000',
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-[11px] font-semibold text-zinc-200 hover:border-amber-400 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: p.fg }}
                      />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>

                {/* Color Inputs */}
                <div className="grid grid-cols-3 gap-2.5">
                  <label className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 block cursor-pointer">
                    <span className="block text-[11px] text-zinc-400 mb-1">Pattern</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customization.fgColor}
                        onChange={(e) =>
                          updateStyle({
                            fgColor: e.target.value,
                            eyeFrameColor: e.target.value,
                            eyeBallColor: e.target.value,
                          })
                        }
                        className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono text-zinc-200 uppercase">
                        {customization.fgColor}
                      </span>
                    </div>
                  </label>

                  <label className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 block cursor-pointer">
                    <span className="block text-[11px] text-zinc-400 mb-1">Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customization.bgColor}
                        onChange={(e) => updateStyle({ bgColor: e.target.value })}
                        className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono text-zinc-200 uppercase">
                        {customization.bgColor}
                      </span>
                    </div>
                  </label>

                  <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-zinc-400">Gradient</span>
                      <input
                        type="checkbox"
                        checked={customization.useGradient}
                        onChange={(e) => updateStyle({ useGradient: e.target.checked })}
                        className="accent-amber-400 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        disabled={!customization.useGradient}
                        value={customization.gradientColor2}
                        onChange={(e) => updateStyle({ gradientColor2: e.target.value })}
                        className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer disabled:opacity-30"
                      />
                      <span className="text-[11px] font-mono text-zinc-200 uppercase">
                        {customization.gradientColor2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dot Style & Corner Eye */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                      Dot Matrix Style
                    </label>
                    <select
                      value={customization.dotStyle}
                      onChange={(e) => updateStyle({ dotStyle: e.target.value as any })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-white"
                    >
                      <option value="square">Classic Square</option>
                      <option value="rounded">Soft Rounded</option>
                      <option value="dots">Circular Dots</option>
                      <option value="classy">Classy Diamond</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                      Corner Eye Geometry
                    </label>
                    <select
                      value={customization.cornerStyle}
                      onChange={(e) => updateStyle({ cornerStyle: e.target.value as any })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-white"
                    >
                      <option value="square">Square Eyes</option>
                      <option value="rounded">Rounded Eyes</option>
                      <option value="extra-rounded">Squircle Eyes</option>
                      <option value="circle">Circular Eyes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {styleTab === 'logo' && (
              <div className="space-y-4">
                <input
                  ref={logoUploadRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logoUploadRef.current?.click()}
                    className="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    Upload Center Logo (PNG/SVG)
                  </button>
                  {(customization.customLogoUrl || customization.logoPreset) && (
                    <button
                      onClick={() => updateStyle({ customLogoUrl: null, logoPreset: null })}
                      className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(PRESET_LOGOS).slice(0, 8).map(([key, item]) => {
                    const active = customization.logoPreset === key && !customization.customLogoUrl;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          updateStyle({
                            logoPreset: active ? null : key,
                            customLogoUrl: null,
                            errorCorrection: 'H',
                          })
                        }
                        className={`p-2 rounded-xl border text-[11px] font-semibold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          active
                            ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div
                          className="w-4 h-4 text-amber-400"
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                        <span className="truncate w-full text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {styleTab === 'frame' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                      Standard Frame Style
                    </label>
                    <select
                      value={customization.frameType}
                      onChange={(e) => updateStyle({ frameType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-white"
                    >
                      <option value="none">No Frame (Clean)</option>
                      <option value="bottom-bar">Bottom Ribbon</option>
                      <option value="top-header">Top Banner</option>
                      <option value="polaroid">Polaroid Card</option>
                      <option value="badge">Compact Badge</option>
                      <option value="minimal-tag">Minimalist Border</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                      Default CTA Banner
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={customization.frameText}
                      onChange={(e) => updateStyle({ frameText: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                      Export Resolution
                    </label>
                    <select
                      value={customization.size}
                      onChange={(e) => updateStyle({ size: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono font-bold text-amber-300"
                    >
                      <option value={512}>512 × 512 px (Web)</option>
                      <option value={1024}>1024 × 1024 px (Standard)</option>
                      <option value={2048}>2048 × 2048 px (300 DPI Print)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                      Error Correction
                    </label>
                    <select
                      value={customization.errorCorrection}
                      onChange={(e) => updateStyle({ errorCorrection: e.target.value as any })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono font-bold text-white"
                    >
                      <option value="L">Level L (7%)</option>
                      <option value="M">Level M (15%)</option>
                      <option value="Q">Level Q (25%)</option>
                      <option value="H">Level H (30% - Logos)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Batch Output Queue & Bulk Download Toolbar */}
        <div className="p-6 bg-zinc-950/95 border border-zinc-800 rounded-3xl space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-extrabold text-white">
                04. Generated Batch ({filteredItems.length})
              </h2>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => {
                    setFilterQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter labels or URLs..."
                  className="pl-8 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleAddBlankRow}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Row</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Card Grid View"
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === 'grid' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  title="Compact Table View"
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    viewMode === 'table' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bulk Export Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                {(['png', 'svg', 'jpg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-lg cursor-pointer transition-colors ${
                      exportFormat === fmt
                        ? 'bg-amber-400 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePrintSheet}
                disabled={validItems.length === 0 || isPreparingPrint}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 whitespace-nowrap shrink-0"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{isPreparingPrint ? 'Preparing Sheet...' : 'Print Sheet'}</span>
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={validItems.length === 0 || isExporting}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-500 text-black font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer disabled:opacity-40 whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExporting
                    ? `Packing ${exportProgress.done} / ${exportProgress.total}...`
                    : `Download All ZIP (${validItems.length})`}
                </span>
              </button>
            </div>
          </div>

          {exportMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4 shrink-0" />
              <span>{exportMessage}</span>
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-black/40 border border-zinc-800 rounded-2xl space-y-3">
              <FileSpreadsheet className="w-8 h-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No QR codes in current batch</h3>
              <p className="text-xs text-zinc-400">
                Upload a CSV file, load a sample template above, or click Add Row to start generating.
              </p>
              <button
                onClick={() => applyCsvSource(BATCH_TEMPLATES[0].csv, BATCH_TEMPLATES[0].filename)}
                className="px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-xl cursor-pointer"
              >
                Load Sample CSV
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid Preview View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-black/50 border border-zinc-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono tabular-nums text-zinc-500">
                        #{String(item.index + 1).padStart(3, '0')}
                      </div>
                      <h3 className="text-sm font-bold text-white truncate" title={item.label}>
                        {item.label}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteRow(item.index)}
                      title="Remove item"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 flex items-center justify-center">
                    {item.isValid ? (
                      <BatchQRThumbnail
                        payload={item.payload}
                        customization={item.rowCustomization}
                        className="w-36 h-36"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-xs text-red-400 text-center px-2">
                        Empty payload in mapped column
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className="text-[11px] font-mono text-zinc-400 truncate bg-zinc-900/80 px-2.5 py-1.5 rounded-lg"
                      title={item.payload}
                    >
                      {item.payload || '—'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        disabled={!item.isValid}
                        onClick={() => handleDownloadSingle(item, 'png')}
                        className="py-2 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>PNG</span>
                      </button>
                      <button
                        disabled={!item.isValid}
                        onClick={() => handleDownloadSingle(item, 'svg')}
                        className="py-2 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-300 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <Download className="w-3 h-3" />
                        <span>SVG</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* High-Density Editable Table View */
            <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400">
                    <th className="py-3 px-4 font-semibold">#</th>
                    <th className="py-3 px-4 font-semibold">Preview</th>
                    <th className="py-3 px-4 font-semibold">Label</th>
                    <th className="py-3 px-4 font-semibold">Encoded Payload</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 px-4 font-mono tabular-nums text-zinc-500">
                        {item.index + 1}
                      </td>
                      <td className="py-2.5 px-4">
                        {item.isValid ? (
                          <BatchQRThumbnail
                            payload={item.payload}
                            customization={item.rowCustomization}
                            className="w-12 h-12"
                          />
                        ) : (
                          <span className="text-red-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {mapping.labelColumn ? (
                          <input
                            type="text"
                            value={item.rawRow[mapping.labelColumn] || ''}
                            onChange={(e) =>
                              handleUpdateRowCell(item.index, mapping.labelColumn, e.target.value)
                            }
                            className="w-40 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                          />
                        ) : (
                          <span className="font-bold text-white">{item.label}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 max-w-md">
                        {mapping.mode === 'direct' && mapping.contentColumn ? (
                          <input
                            type="text"
                            value={item.rawRow[mapping.contentColumn] || ''}
                            onChange={(e) =>
                              handleUpdateRowCell(item.index, mapping.contentColumn, e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-[11px] text-zinc-200 focus:outline-hidden focus:border-amber-400"
                          />
                        ) : (
                          <span className="font-mono text-[11px] text-zinc-300 truncate block">
                            {item.payload}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {item.isValid ? (
                          <span className="text-emerald-400 font-semibold">Ready</span>
                        ) : (
                          <span className="text-red-400 font-semibold">Empty</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          disabled={!item.isValid}
                          onClick={() => handleDownloadSingle(item, exportFormat)}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-300 font-bold rounded-lg cursor-pointer disabled:opacity-40"
                        >
                          Download {exportFormat.toUpperCase()}
                        </button>
                        <button
                          onClick={() => handleDeleteRow(item.index)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer inline-flex align-middle"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
              <div className="font-mono tabular-nums">
                Page {safePage} of {totalPages} · Showing {paginatedItems.length} of {filteredItems.length} codes
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Print Sheet Output (Visible only in @media print) */}
      <div className="hidden print-only p-8 bg-white text-black">
        <div className="mb-6 pb-4 border-b border-gray-300 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">2qrcode.com — Batch QR Code Sheet</h1>
            <p className="text-xs text-gray-600">
              Generated locally · {printItems.length} codes
            </p>
          </div>
          <div className="text-xs text-gray-500 font-mono">https://2qrcode.com</div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {printItems.map((p, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-3 flex flex-col items-center text-center break-inside-avoid"
            >
              <img src={p.dataUrl} alt={p.label} className="w-40 h-40 object-contain" />
              <div className="mt-2 text-xs font-bold text-gray-900">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
