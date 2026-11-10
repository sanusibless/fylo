import { useState } from 'react';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Link, useForm, Head } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome back" description="Enter your email and password to access your drive">
            <Head title="Log in" />

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email Address */}
                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-200">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        placeholder="alex@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="bg-[#202a3c] border-slate-700 text-white placeholder:text-gray-500"
                    />
                    <InputError message={errors.email} />
                </div>

                {/* Password with Visibility Toggle */}
                <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-xs font-semibold text-gray-200">
                            Password
                        </Label>
                        {canResetPassword && (
                            <Link
                                href={request()}
                                tabIndex={5}
                                className="text-xs text-teal-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={2}
                            placeholder="Enter your password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="bg-[#202a3c] border-slate-700 text-white placeholder:text-gray-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                        id="remember"
                        tabIndex={3}
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', checked === true)}
                        className="border-slate-600 data-[state=checked]:bg-teal-400 data-[state=checked]:text-slate-900"
                    />
                    <label htmlFor="remember" className="text-xs text-gray-300">
                        Remember this device for 30 days
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    tabIndex={4}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all mt-2"
                >
                    {processing ? (
                        <span className="flex items-center space-x-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            <span>Signing in...</span>
                        </span>
                    ) : (
                        <span>Sign In</span>
                    )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center text-xs text-gray-400 mt-2">
                    Don't have a Fylo account?{' '}
                    <Link href={register()} className="text-teal-400 hover:underline font-semibold" tabIndex={6}>
                        Get started free
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
