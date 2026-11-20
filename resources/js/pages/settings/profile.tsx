import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, User, Mail, Phone, ShieldAlert, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const joinedDate = auth.user.created_at
        ? new Date(auth.user.created_at).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Recently';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings - Fylo" />

            <SettingsLayout>
                {/* Personal Details Card */}
                <div className="bg-[#202a3c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-800">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                                <User className="w-5 h-5 text-teal-400" />
                                <span>Personal Information</span>
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Update your display name, primary email address, and Nigerian or international contact phone number.
                            </p>
                        </div>

                        <div className="flex items-center space-x-1.5 text-xs text-gray-400 bg-[#0b1523]/70 px-3 py-1.5 rounded-xl border border-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            <span>Member since {joinedDate}</span>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onSuccess={() => toast.success('Profile updated successfully')}
                        className="space-y-5"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="text-xs font-semibold text-gray-200 flex items-center">
                                            <User className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                                            Full Name
                                        </Label>

                                        <Input
                                            id="name"
                                            className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs h-10"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="e.g. Chinedu Okafor"
                                        />

                                        <InputError className="mt-1" message={errors.name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-xs font-semibold text-gray-200 flex items-center">
                                            <Phone className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                                            Phone Number (Abuja / Nigeria)
                                        </Label>

                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs h-10"
                                            defaultValue={auth.user.phone || ''}
                                            name="phone"
                                            autoComplete="tel"
                                            placeholder="+234 803 000 0000"
                                        />

                                        <InputError className="mt-1" message={errors.phone} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-semibold text-gray-200 flex items-center">
                                        <Mail className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                                        Email Address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="bg-[#0b1523] border-slate-700 text-white placeholder:text-gray-500 text-xs h-10"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="chinedu@example.com"
                                    />

                                    <p className="text-[11px] text-gray-400">
                                        This email is used for account sign-in, password recovery, and receiving direct file shares from teammates.
                                    </p>

                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                                            <span>Your email address is currently unverified.</span>
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-teal-400 font-semibold underline hover:text-teal-300"
                                            >
                                                Resend verification email
                                            </Link>
                                        </div>

                                        {status === 'verification-link-sent' && (
                                            <div className="text-xs font-medium text-emerald-400">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2 flex items-center gap-4 border-t border-slate-800/80">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                                    >
                                        {processing ? 'Saving...' : 'Save Profile Changes'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful || status === 'profile-updated'}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-xs font-semibold text-emerald-400 flex items-center">
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                            Profile changes saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Danger Zone: Delete Account */}
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
