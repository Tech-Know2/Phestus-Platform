'use client'

import { useEffect, useState } from 'react'
import {
    AlertCircle,
    CheckCircle2,
    Info,
    Wrench,
    Bug,
    X,
} from 'lucide-react'

import {
    announcementData,
    type AnnouncementType,
} from '@/lib/site-data'

const announcementStyles: Record<
    AnnouncementType,
    {
        icon: typeof Info
        className: string
    }
> = {
    info: {
        icon: Info,
        className:
            'bg-[var(--theme-accent-50)] text-[var(--theme-accent-800)] border-[var(--theme-accent-200)]',
    },
    success: {
        icon: CheckCircle2,
        className:
            'bg-[var(--color-success-50)] text-[var(--color-success-800)] border-[var(--color-success-200)]',
    },
    warning: {
        icon: AlertCircle,
        className:
            'bg-[var(--color-warning-50)] text-[var(--color-warning-800)] border-[var(--color-warning-200)]',
    },
    error: {
        icon: AlertCircle,
        className:
            'bg-[var(--color-error-50)] text-[var(--color-error-800)] border-[var(--color-error-200)]',
    },
    maintenance: {
        icon: Wrench,
        className:
            'bg-[var(--theme-elevation-50)] text-[var(--theme-elevation-800)] border-[var(--theme-elevation-200)]',
    },
    bug: {
        icon: Bug,
        className:
            'bg-[var(--color-error-50)] text-[var(--color-error-800)] border-[var(--color-error-200)]',
    },
}

export function AnnouncementBar() {
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        setDismissed(
            localStorage.getItem('phestus-announcement-dismissed') ===
            announcementData.message,
        )
    }, [])

    if (!announcementData.enabled || dismissed) {
        return null
    }

    const style = announcementStyles[announcementData.type]
    const Icon = style.icon

    function dismiss() {
        localStorage.setItem(
            'phestus-announcement-dismissed',
            announcementData.message,
        )

        setDismissed(true)
    }

    return (
        <div
            role="status"
            className={`border-b ${style.className}`}
        >
            <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center gap-2 px-4 py-2 text-sm">
                <Icon className="h-4 w-4 shrink-0" />

                <span className="text-center">
                    {announcementData.message}
                </span>

                {announcementData.link && (
                    <a
                        href={announcementData.link.href}
                        className="shrink-0 font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                    >
                        {announcementData.link.label}
                    </a>
                )}

                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss announcement"
                    className="ml-2 shrink-0 rounded-[var(--style-radius-s)] p-1 transition-opacity hover:opacity-60"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}