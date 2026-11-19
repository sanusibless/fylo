import { cn, formatStorageGB } from '@/lib/utils';
import { appearance } from '@/routes';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    User,
    KeyRound,
    Palette,
    CreditCard,
    HardDrive,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
} from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile Information',
        href: edit(),
        icon: User,
    },
    {
        title: 'Password & Security',
        href: editPassword(),
        icon: KeyRound,
    },
    {
        title: 'Appearance & Theme',
        href: appearance(),
        icon: Palette,
    },
    {
        title: 'Subscription & Storage',
        href: '/subscription',
        icon: CreditCard,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { auth, storage, appConfig } = usePage<SharedData>().props;

    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;
    const user = auth?.user;
    const totalUsed = Number(storage?.totalUsed ?? 0);
    const totalAvailable = Number(storage?.totalAvailable ?? 10);
    const planName = storage?.planName ?? 'Free';
    const progressPercent =
        totalAvailable > 0 ? Math.min(100, Math.round((totalUsed / totalAvailable) * 100)) : 0;

    return (
        <div className="space-y-6">
            {/* Top Account Summary Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#202a3c] via-[#1c2431] to-[#0b1523] border border-slate-800 p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* User Identity */}
                    <div className="flex items-start sm:items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-slate-950 font-extrabold text-xl shrink-0 shadow-lg shadow-teal-500/20">
                            {user?.initial || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'U')}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                                    {user?.name || 'Account Settings'}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                                    {planName} Plan
                                </span>
                                {user?.email_verified_at && (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>Verified</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                <span className="flex items-center space-x-1.5">
                                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                                    <span>{user?.email}</span>
                                </span>
                                {user?.phone && (
                                    <span className="flex items-center space-x-1.5">
                                        <Phone className="w-3.5 h-3.5 text-teal-400" />
                                        <span>{user.phone}</span>
                                    </span>
                                )}
                                <span className="flex items-center space-x-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                                    <span>{appConfig?.location?.short || 'Abuja, Nigeria'}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Storage Mini Card */}
                    <div className="w-full lg:w-80 bg-[#0b1523]/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300 font-semibold flex items-center">
                                <HardDrive className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                                Storage Quota
                            </span>
                            <span className="font-mono text-white">
                                {formatStorageGB(totalUsed, storage?.totalUsedBytes)} /{' '}
                                {totalAvailable >= 9999 ? 'Unlimited' : `${totalAvailable} GB`}
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Max upload: {storage?.maxFileSizeMB || 50} MB / file</span>
                            <Link
                                href="/subscription"
                                className="text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center"
                            >
                                <span>Upgrade (₦)</span>
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Navigation & Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Navigation Tabs */}
                <aside className="lg:col-span-3 bg-[#202a3c] border border-slate-800 rounded-3xl p-3 shadow-xl">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                            Account Preferences
                        </p>
                    </div>
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item, index) => {
                            const itemUrl = typeof item.href === 'string' ? item.href : item.href.url;
                            const isActive = currentPath === itemUrl;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={`${itemUrl}-${index}`}
                                    href={item.href}
                                    prefetch
                                    className={cn(
                                        'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                                        isActive
                                            ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-teal-500/15'
                                            : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
                                    )}
                                >
                                    {Icon && (
                                        <Icon
                                            className={cn(
                                                'h-4 w-4 shrink-0',
                                                isActive ? 'text-slate-950' : 'text-teal-400'
                                            )}
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Panel */}
                <div className="lg:col-span-9 space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
