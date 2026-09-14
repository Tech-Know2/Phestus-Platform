'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/ops/accounts'

export default function LoginPage() {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        setError('')
        setLoading(true)

        const result = await login({
            email: String(formData.get('email')),
            password: String(formData.get('password')),
        })

        setLoading(false)

        if (!result.success) {
            setError(result.error || 'Invalid email or password.')
            return
        }

        router.push('/')
        router.refresh()
    }

    return (
        <div>
            <div className="mb-8">
                <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                    Account
                </p>

                <h1 className="m-0 font-[var(--font-body)] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--theme-elevation-950)]">
                    Welcome back.
                </h1>

                <p className="mt-4 text-[14px] leading-[1.6] text-[var(--theme-elevation-550)]">
                    Sign in to manage your Phestus account and projects.
                </p>
            </div>

            <form
                className="space-y-5"
                action={handleSubmit}
            >
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
                        className="h-11 w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3.5 text-[14px] text-[var(--theme-elevation-900)] outline-none transition-all placeholder:text-[var(--theme-elevation-400)] focus:border-[var(--theme-accent-500)] focus:ring-2 focus:ring-[var(--theme-accent-100)]"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="block text-[12px] font-medium text-[var(--theme-elevation-700)]"
                        >
                            Password
                        </label>

                        <Link
                            href="/forgot-password"
                            className="text-[12px] text-[var(--theme-accent-600)] no-underline hover:text-[var(--theme-accent-700)]"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="h-11 w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3.5 text-[14px] text-[var(--theme-elevation-900)] outline-none transition-all placeholder:text-[var(--theme-elevation-400)] focus:border-[var(--theme-accent-500)] focus:ring-2 focus:ring-[var(--theme-accent-100)]"
                    />
                </div>

                {error && (
                    <div className="rounded-[var(--style-radius-s)] border border-[var(--color-error-200)] bg-[var(--color-error-50)] px-3.5 py-3 text-[13px] text-[var(--color-error-700)]">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-[var(--style-radius-s)] bg-[var(--theme-accent-600)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--theme-accent-700)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <div className="mt-8 border-t border-[var(--theme-elevation-150)] pt-6 text-center">
                <p className="m-0 text-[13px] text-[var(--theme-elevation-550)]">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-[var(--theme-accent-600)] no-underline hover:text-[var(--theme-accent-700)]"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}