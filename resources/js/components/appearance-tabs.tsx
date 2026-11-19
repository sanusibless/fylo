import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { toast } from 'sonner';

export default function AppearanceTabs({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string; description: string }[] = [
        {
            value: 'dark',
            icon: Moon,
            label: 'Dark Mode',
            description: 'Deep navy & teal palette optimized for reduced eye strain.',
        },
        {
            value: 'light',
            icon: Sun,
            label: 'Light Mode',
            description: 'High-contrast bright mode for daylight environments.',
        },
        {
            value: 'system',
            icon: Monitor,
            label: 'System Preference',
            description: 'Automatically syncs with your device OS theme.',
        },
    ];

    const handleSelect = (mode: Appearance, label: string) => {
        updateAppearance(mode);
        toast.success(`Theme preference set to ${label}`);
    };

    return (
        <div className={cn('space-y-6', className)} {...props}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tabs.map(({ value, icon: Icon, label, description }) => {
                    const isSelected = appearance === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleSelect(value, label)}
                            className={cn(
                                'flex flex-col justify-between p-5 rounded-2xl border text-left transition-all relative',
                                isSelected
                                    ? 'bg-teal-500/15 border-2 border-teal-400 shadow-lg shadow-teal-500/10'
                                    : 'bg-[#0b1523]/70 border-slate-800 hover:border-slate-700 text-gray-300'
                            )}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={cn(
                                            'w-10 h-10 rounded-xl flex items-center justify-center',
                                            isSelected
                                                ? 'bg-teal-400 text-slate-950'
                                                : 'bg-slate-800 text-teal-400'
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    {isSelected && (
                                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" />
                                            Active
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">{label}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
