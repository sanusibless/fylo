import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { appearance } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: appearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance & Theme - Fylo" />

            <SettingsLayout>
                <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="pb-4 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                            <Palette className="w-5 h-5 text-teal-400" />
                            <span>Workspace Appearance &amp; Theme</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Customize how Fylo looks on your device. Your selection is saved across sessions.
                        </p>
                    </div>

                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
