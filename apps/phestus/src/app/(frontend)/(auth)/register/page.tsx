'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAccount } from '@/lib/ops/accounts'

const inputClass =
    'h-11 w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3.5 text-[14px] text-[var(--theme-elevation-900)] outline-none transition-all focus:border-[var(--theme-accent-500)] focus:ring-2 focus:ring-[var(--theme-accent-100)]'

export default function RegisterPage() {
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const passwordChecks = {
        length: password.length > 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword

    const passwordValid =
        passwordChecks.length &&
        passwordChecks.uppercase &&
        passwordChecks.lowercase &&
        passwordChecks.special &&
        passwordsMatch

    async function handleSubmit(formData: FormData) {
        setError('')

        if (!passwordValid) {
            setError('Please make sure your password meets all requirements.')
            return
        }

        setLoading(true)

        const result = await createAccount({
            firstName: String(formData.get('firstName')),
            lastName: String(formData.get('lastName')),
            username: String(formData.get('username')),
            email: String(formData.get('email')),
            password,
            accountType: 'personal',
        })

        setLoading(false)

        if (!result.success) {
            setError(result.error || 'There was a problem creating your account.')
            return
        }

        router.push('/login')
    }

    const Check = ({
        valid,
        children,
    }: {
        valid: boolean
        children: React.ReactNode
    }) => (
        <li
            className={`flex items-center gap-2 text-[12px] transition-colors ${valid
                    ? 'text-[var(--color-success-600)]'
                    : 'text-[var(--theme-elevation-500)]'
                }`}
        >
            <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${valid
                        ? 'border-[var(--color-success-500)] bg-[var(--color-success-50)]'
                        : 'border-[var(--theme-elevation-300)]'
                    }`}
            >
                {valid ? '✓' : ''}
            </span>
            {children}
        </li>
    )

    return (
        <div>
            <div className="mb-8">
                <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                    Account
                </p>

                <h1 className="m-0 font-[var(--font-body)] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--theme-elevation-950)]">
                    Create your account.
                </h1>

                <p className="mt-4 text-[14px] leading-[1.6] text-[var(--theme-elevation-550)]">
                    Create an account to use Phestus, manage your projects,
                    and access the marketplace.
                </p>
            </div>

            <form
                className="space-y-5"
                action={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                        >
                            First name
                        </label>

                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="lastName"
                            className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                        >
                            Last name
                        </label>

                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                    >
                        Username
                    </label>

                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder="yourname"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                    />

                    <ul className="mt-3 space-y-1.5">
                        <Check valid={passwordChecks.length}>
                            More than 8 characters
                        </Check>

                        <Check valid={passwordChecks.uppercase}>
                            At least one uppercase letter
                        </Check>

                        <Check valid={passwordChecks.lowercase}>
                            At least one lowercase letter
                        </Check>

                        <Check valid={passwordChecks.special}>
                            At least one special character
                        </Check>
                    </ul>
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                    >
                        Confirm password
                    </label>

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} ${confirmPassword.length > 0
                                ? passwordsMatch
                                    ? 'border-[var(--color-success-500)]'
                                    : 'border-[var(--color-error-500)]'
                                : ''
                            }`}
                    />

                    {confirmPassword.length > 0 && (
                        <p
                            className={`mt-2 text-[12px] ${passwordsMatch
                                    ? 'text-[var(--color-success-600)]'
                                    : 'text-[var(--color-error-600)]'
                                }`}
                        >
                            {passwordsMatch
                                ? 'Passwords match'
                                : 'Passwords do not match'}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="rounded-[var(--style-radius-s)] border border-[var(--color-error-200)] bg-[var(--color-error-50)] px-3.5 py-3 text-[13px] text-[var(--color-error-700)]">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!passwordValid || loading}
                    className="h-11 w-full rounded-[var(--style-radius-s)] bg-[var(--theme-accent-600)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--theme-accent-700)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <div className="mt-8 border-t border-[var(--theme-elevation-150)] pt-6 text-center">
                <p className="m-0 text-[13px] text-[var(--theme-elevation-550)]">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-[var(--theme-accent-600)] no-underline hover:text-[var(--theme-accent-700)]"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}