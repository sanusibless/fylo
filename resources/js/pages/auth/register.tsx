import { useState } from 'react';
import { login } from '@/routes';
import { Link, useForm, Head } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, ShieldCheck, Check, AlertCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    // Password strength computation
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

    const strength = calculateStrength(data.password);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create your free account" description="Get 10 GB secure cloud storage instantly">
            <Head title="Register" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Full Name */}
                <div className="grid gap-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-gray-200">
                        Full Name
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        placeholder="e.g. Alex Morgan"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="bg-[#202a3c] border-slate-700 text-white placeholder:text-gray-500"
                    />
                    <InputError message={errors.name} />
                </div>

                {/* Email Address */}
                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-200">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        tabIndex={2}
                        placeholder="alex@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="bg-[#202a3c] border-slate-700 text-white placeholder:text-gray-500"
                    />
                    <InputError message={errors.email} />
                </div>

                {/* Phone Number (Optional) */}
                <div className="grid gap-1.5">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="phone" className="text-xs font-semibold text-gray-200">
                            Phone Number
                        </Label>
                        <span className="text-[11px] text-gray-400">Optional</span>
                    </div>
                    <Input
                        id="phone"
                        type="tel"
                        tabIndex={3}
                        placeholder="+1 (555) 000-0000"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="bg-[#202a3c] border-slate-700 text-white placeholder:text-gray-500"
                    />
                    <InputError message={errors.phone} />
                </div>

                {/* Password with Visibility Toggle & Strength Meter */}
                <div className="grid gap-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold text-gray-200">
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={4}
                            placeholder="At least 8 characters"
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

                    {/* Password Strength Meter */}
                    {data.password && (
                        <div className="mt-1 space-y-1">
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${strength.color}`}
                                    style={{ width: `${strength.score}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[11px] text-gray-400">
                                <span>Strength: <strong className="text-white">{strength.label}</strong></span>
                                <span>Min 8 characters, numbers &amp; symbols</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Confirmation */}
                <div className="grid gap-1.5">
                    <Label htmlFor="password_confirmation" className="text-xs font-semibold text-gray-200">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            tabIndex={5}
                            placeholder="Re-enter your password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="bg-[#202a3c] border-slate-700 text-white placeholder:text-gray-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label="Toggle confirm password visibility"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start space-x-2 pt-1">
                    <Checkbox
                        id="terms"
                        tabIndex={6}
                        checked={data.terms}
                        onCheckedChange={(checked) => setData('terms', checked === true)}
                        className="mt-0.5 border-slate-600 data-[state=checked]:bg-teal-400 data-[state=checked]:text-slate-900"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-300 leading-tight">
                        I agree to the{' '}
                        <Link href="/terms" className="text-teal-400 hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-teal-400 hover:underline">
                            Privacy Policy
                        </Link>
                    </label>
                </div>
                <InputError message={errors.terms} />

                {/* Submit Button */}
                <Button
                    type="submit"
                    tabIndex={7}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all mt-2"
                >
                    {processing ? (
                        <span className="flex items-center space-x-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            <span>Creating account...</span>
                        </span>
                    ) : (
                        <span>Create Account</span>
                    )}
                </Button>

                {/* Login Link */}
                <div className="text-center text-xs text-gray-400 mt-2">
                    Already have an account?{' '}
                    <Link href={login()} className="text-teal-400 hover:underline font-semibold" tabIndex={8}>
                        Log in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
