import ReactMarkdown from 'react-markdown'

type Props = {
    content: string
}

export function MarkdownContent({ content }: Props) {
    return (
        <div className="text-[16px] leading-7 text-[var(--theme-elevation-700)]">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => (
                        <h1 className="mb-6 mt-12 text-3xl font-semibold tracking-[-0.025em] text-[var(--theme-elevation-900)] first:mt-0">
                            {children}
                        </h1>
                    ),

                    h2: ({ children }) => (
                        <h2 className="mb-4 mt-12 border-b border-[var(--theme-elevation-150)] pb-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--theme-elevation-900)]">
                            {children}
                        </h2>
                    ),

                    h3: ({ children }) => (
                        <h3 className="mb-3 mt-8 text-xl font-semibold tracking-[-0.015em] text-[var(--theme-elevation-900)]">
                            {children}
                        </h3>
                    ),

                    h4: ({ children }) => (
                        <h4 className="mb-2 mt-6 text-base font-semibold text-[var(--theme-elevation-900)]">
                            {children}
                        </h4>
                    ),

                    p: ({ children }) => (
                        <p className="mb-5 leading-7">
                            {children}
                        </p>
                    ),

                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="font-medium text-[var(--theme-accent-600)] underline decoration-[var(--theme-accent-200)] underline-offset-4 transition-colors hover:text-[var(--theme-accent-700)] hover:decoration-[var(--theme-accent-400)]"
                        >
                            {children}
                        </a>
                    ),

                    strong: ({ children }) => (
                        <strong className="font-semibold text-[var(--theme-elevation-850)]">
                            {children}
                        </strong>
                    ),

                    em: ({ children }) => (
                        <em className="text-[var(--theme-elevation-800)]">
                            {children}
                        </em>
                    ),

                    ul: ({ children }) => (
                        <ul className="mb-6 ml-5 list-disc space-y-2">
                            {children}
                        </ul>
                    ),

                    ol: ({ children }) => (
                        <ol className="mb-6 ml-5 list-decimal space-y-2">
                            {children}
                        </ol>
                    ),

                    li: ({ children }) => (
                        <li className="pl-1 leading-7">
                            {children}
                        </li>
                    ),

                    blockquote: ({ children }) => (
                        <blockquote className="my-6 border-l-2 border-[var(--theme-accent-500)] bg-[var(--theme-accent-50)] px-5 py-3 text-[var(--theme-elevation-700)]">
                            {children}
                        </blockquote>
                    ),

                    hr: () => (
                        <hr className="my-10 border-0 border-t border-[var(--theme-elevation-150)]" />
                    ),

                    code: ({ children, className }) => {
                        const isBlock = className?.includes('language-')

                        if (isBlock) {
                            return (
                                <code
                                    className={`${className ?? ''} font-[var(--font-mono)] text-sm leading-6`}
                                >
                                    {children}
                                </code>
                            )
                        }

                        return (
                            <code className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-100)] px-1.5 py-0.5 font-[var(--font-mono)] text-[13px] text-[var(--theme-accent-700)]">
                                {children}
                            </code>
                        )
                    },

                    pre: ({ children }) => (
                        <pre className="my-6 overflow-x-auto rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-950)] p-5 text-[var(--color-base-100)] shadow-sm">
                            {children}
                        </pre>
                    ),

                    table: ({ children }) => (
                        <div className="my-6 overflow-x-auto rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)]">
                            <table className="w-full border-collapse text-sm">
                                {children}
                            </table>
                        </div>
                    ),

                    thead: ({ children }) => (
                        <thead className="bg-[var(--theme-elevation-50)]">
                            {children}
                        </thead>
                    ),

                    th: ({ children }) => (
                        <th className="border-b border-[var(--theme-elevation-200)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.05em] text-[var(--theme-elevation-700)]">
                            {children}
                        </th>
                    ),

                    td: ({ children }) => (
                        <td className="border-b border-[var(--theme-elevation-150)] px-4 py-3 text-[var(--theme-elevation-700)]">
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}