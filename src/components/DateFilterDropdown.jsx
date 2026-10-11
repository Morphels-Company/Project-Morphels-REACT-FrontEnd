import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

// Opções de período pré-definidas
function getPeriods() {
    const now   = new Date();
    const y     = now.getFullYear();
    const m     = now.getMonth();

    const start = (year, month, day = 1) =>
        new Date(year, month, day).toISOString();
    const end = (year, month, day) =>
        new Date(year, month, day, 23, 59, 59).toISOString();

    const monthName = (month) =>
        new Date(y, month).toLocaleString('pt-BR', { month: 'long' })
            .replace(/^\w/, c => c.toUpperCase());

    return [
        {
            key: 'this_month',
            label: `Este mês (${monthName(m)})`,
            start: start(y, m),
            end:   now.toISOString(),
        },
        {
            key: 'last_month',
            label: `Mês passado (${monthName(m - 1)})`,
            start: start(y, m - 1),
            end:   end(y, m, 0),
        },
        {
            key: 'last_3',
            label: 'Últimos 3 meses',
            start: start(y, m - 2),
            end:   now.toISOString(),
        },
        {
            key: 'last_6',
            label: 'Últimos 6 meses',
            start: start(y, m - 5),
            end:   now.toISOString(),
        },
        {
            key: 'this_year',
            label: `Este ano (${y})`,
            start: start(y, 0),
            end:   now.toISOString(),
        },
        {
            key: 'last_year',
            label: `Ano passado (${y - 1})`,
            start: start(y - 1, 0),
            end:   end(y - 1, 11, 31),
        },
        {
            key: 'all',
            label: 'Todo o período',
            start: start(2000, 0),
            end:   now.toISOString(),
        },
    ];
}

// ─── DateFilterDropdown ────────────────────────────────────────────────────────
// Props:
//   onApply({ start_date, end_date }) — chamado ao selecionar ou aplicar período
//   defaultPeriodKey                  — key do período inicial (padrão: 'this_month')

export default function DateFilterDropdown({
    onApply,
    defaultPeriodKey = 'this_month',
}) {
    const periods = getPeriods();
    const defaultPeriod = periods.find(p => p.key === defaultPeriodKey) ?? periods[0];

    const [open, setOpen]             = useState(false);
    const [selected, setSelected]     = useState(defaultPeriod);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd]   = useState('');
    const ref = useRef(null);

    // fecha ao clicar fora
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectPeriod = (period) => {
        setSelected(period);
        setCustomStart('');
        setCustomEnd('');
        setOpen(false);
        onApply({ start_date: period.start, end_date: period.end });
    };

    const applyCustom = () => {
        if (!customStart || !customEnd) return;
        const label = `${customStart} até ${customEnd}`;
        const period = {
            key:   'custom',
            label,
            start: new Date(customStart).toISOString(),
            end:   new Date(customEnd + 'T23:59:59').toISOString(),
        };
        setSelected(period);
        setOpen(false);
        onApply({ start_date: period.start, end_date: period.end });
    };

    return (
        <div className="relative" ref={ref}>
            {/* botão principal */}
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 bg-bg-secondary-color border border-bg-secondary-destack-color text-sm px-3 py-2 rounded-md hover:bg-bg-secondary-destack-color transition-colors"
            >
                <Calendar size={14} className="text-neutral-500" />
                <span>{selected.label}</span>
                <ChevronDown size={14} className="text-neutral-500" />
            </button>

            {/* dropdown */}
            {open && (
                <div className="absolute right-0 mt-1 w-80 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-lg z-50 overflow-hidden">

                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-4 pt-3 pb-1">
                        Selecionar período
                    </p>

                    {/* períodos pré-definidos */}
                    {periods.map(period => (
                        <button
                            key={period.key}
                            onClick={() => selectPeriod(period)}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-bg-secondary-destack-color transition-colors text-left"
                        >
                            <span>{period.label}</span>
                            {selected.key === period.key && (
                                <Check size={14} className="text-neutral-800" />
                            )}
                        </button>
                    ))}

                    {/* divisor + personalizado */}
                    <div className="border-t border-bg-secondary-destack-color mx-4 my-2" />
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-4 pb-1">
                        Personalizado
                    </p>

                    <div className="flex items-center gap-2 px-4 pb-2">
                        <input
                            type="date"
                            value={customStart}
                            onChange={e => setCustomStart(e.target.value)}
                            className="flex-1 text-xs border border-bg-secondary-destack-color rounded px-2 py-1 bg-bg-secondary-color"
                        />
                        <span className="text-xs text-neutral-400">até</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={e => setCustomEnd(e.target.value)}
                            className="flex-1 text-xs border border-bg-secondary-destack-color rounded px-2 py-1 bg-bg-secondary-color"
                        />
                    </div>

                    <div className="px-4 pb-3">
                        <button
                            onClick={applyCustom}
                            disabled={!customStart || !customEnd}
                            className="w-full bg-neutral-950 text-white text-xs py-2 rounded-lg hover:bg-neutral-600 transition-discrete disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Aplicar período
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
