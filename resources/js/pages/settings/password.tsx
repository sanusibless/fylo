import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [newPasswordVal, setNewPasswordVal] = useState('');

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        switch (score) {
            case 1:
                return { score: 25, label: 'Weak', color: 'bg-rose-500' };
            case 2:
                return { score: 50, label: 'Fair', color: 'bg-amber-500' };
            case 3:
                return { score: 75, label: 'Good', color: 'bg-teal-400' };
            case 4:
                return { score: 100, label: 'Strong', color: 'bg-emerald-400' };
            default:
                return { score: 10, label: 'Very Weak', color: 'bg-rose-600' };
        }
    };

    const strength = calculateStrength(newPasswordVal);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password & Security - Fylo" />

            <SettingsLayout>
                <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                                <KeyRound className="w-5 h-5 text-teal-400" />
                                <span>Update Account Password</span>
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Use a strong, unique password with at least 8 characters to keep your cloud drive protected.
                            </p>
                        </div>

                        <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Bcrypt Encrypted</span>
                        </div>
                    </div>

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onSuccess={() => {
                            setNewPasswordVal('');
                            toast.success('Password updated successfully');
                        }}
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-5 max-w-xl"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                {/* Current Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="current_password" className="text-xs font-semibold text-gray-200">
                                        Current Password
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type={showCurrent ? 'text' : 'password'}
                                            className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs h-10 pr-10"
                                            autoComplete="current-password"
                                            placeholder="Enter your current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                            aria-label="Toggle current password visibility"
                                        >
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <InputError message={errors.current_password} />
                                </div>

                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-semibold text-gray-200">
                                        New Password
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type={showNew ? 'text' : 'password'}
                                            onChange={(e) => setNewPasswordVal(e.target.value)}
                                            className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs h-10 pr-10"
                                            autoComplete="new-password"
                                            placeholder="Enter a strong new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                            aria-label="Toggle new password visibility"
                                        >
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {newPasswordVal && (
                                        <div className="pt-1 space-y-1">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${strength.color}`}
                                                    style={{ width: `${strength.score}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[11px] text-gray-400">
                                                <span>
                                                    Strength: <strong className="text-white">{strength.label}</strong>
                                                </span>
                                                <span>Min 8 chars, uppercase, numbers &amp; symbols</span>
                                            </div>
                                        </div>
                                    )}

                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="password_confirmation" className="text-xs font-semibold text-gray-200">
                                        Confirm New Password
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirm ? 'text' : 'password'}
                                            className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs h-10 pr-10"
                                            autoComplete="new-password"
                                            placeholder="Re-enter your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                            aria-label="Toggle confirm password visibility"
                                        >
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="pt-2 flex items-center gap-4 border-t border-slate-800/80">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                                    >
                                        {processing ? 'Updating...' : 'Update Password'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-xs font-semibold text-emerald-400 flex items-center">
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                            Password updated
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
