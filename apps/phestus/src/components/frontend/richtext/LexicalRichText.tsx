import type { ReactNode } from 'react'

type LexicalNode = {
    type?: string
    version?: number
    children?: LexicalNode[]
    text?: string
    format?: number | string
    tag?: string
    listType?: string
    start?: number
    url?: string
    newTab?: boolean
    value?: unknown
    [key: string]: unknown
}

type LexicalRichTextData = {
    root?: {
        type?: string
        children?: LexicalNode[]
        [key: string]: unknown
    }
    [key: string]: unknown
}

type Props = {
    data?: LexicalRichTextData | null
}

export function LexicalRichText({ data }: Props) {
    if (!data?.root?.children?.length) {
        return null
    }

    return (
        <div className="max-w-none text-[16px] leading-7 text-[var(--theme-elevation-700)]">
            {data.root.children.map((node, index) => (
                <LexicalNodeRenderer key={index} node={node} />
            ))}
        </div>
    )
}

function LexicalNodeRenderer({
    node,
}: {
    node: LexicalNode
}): ReactNode {
    switch (node.type) {
        case 'paragraph':
            return (
                <p className="mb-6 last:mb-0">
                    {renderChildren(node.children)}
                </p>
            )

        case 'heading':
            return renderHeading(node)

        case 'quote':
            return (
                <blockquote className="my-8 border-l-2 border-[var(--theme-accent-400)] pl-5 text-[var(--theme-elevation-600)]">
                    {renderChildren(node.children)}
                </blockquote>
            )

        case 'list':
            return renderList(node)

        case 'listitem':
            return (
                <li className="pl-1">
                    {renderChildren(node.children)}
                </li>
            )

        case 'link':
            return renderLink(node)

        case 'text':
            return renderText(node)

        case 'linebreak':
            return <br />

        case 'horizontalrule':
            return (
                <hr className="my-10 border-0 border-t border-[var(--theme-elevation-150)]" />
            )

        case 'code':
            return (
                <pre className="my-6 overflow-x-auto rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] p-5 text-sm leading-6 text-[var(--theme-elevation-800)]">
                    <code>{renderChildren(node.children)}</code>
                </pre>
            )

        default:
            return renderChildren(node.children)
    }
}

function renderChildren(
    children?: LexicalNode[],
): ReactNode[] | null {
    if (!children?.length) {
        return null
    }

    return children.map((child, index) => (
        <LexicalNodeRenderer
            key={index}
            node={child}
        />
    ))
}

function renderHeading(node: LexicalNode) {
    const children = renderChildren(node.children)

    switch (node.tag) {
        case 'h1':
            return (
                <h1 className="mb-6 mt-12 text-4xl font-semibold tracking-[-0.03em] text-[var(--theme-elevation-900)] first:mt-0">
                    {children}
                </h1>
            )

        case 'h2':
            return (
                <h2 className="mb-4 mt-12 text-2xl font-semibold tracking-[-0.02em] text-[var(--theme-elevation-900)]">
                    {children}
                </h2>
            )

        case 'h3':
            return (
                <h3 className="mb-3 mt-10 text-xl font-semibold text-[var(--theme-elevation-900)]">
                    {children}
                </h3>
            )

        case 'h4':
            return (
                <h4 className="mb-3 mt-8 text-lg font-semibold text-[var(--theme-elevation-900)]">
                    {children}
                </h4>
            )

        case 'h5':
            return (
                <h5 className="mb-2 mt-6 text-base font-semibold text-[var(--theme-elevation-900)]">
                    {children}
                </h5>
            )

        case 'h6':
            return (
                <h6 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--theme-elevation-800)]">
                    {children}
                </h6>
            )

        default:
            return (
                <p className="mb-6">
                    {children}
                </p>
            )
    }
}

function renderList(node: LexicalNode) {
    const children = renderChildren(node.children)

    if (node.listType === 'number') {
        return (
            <ol
                start={typeof node.start === 'number' ? node.start : undefined}
                className="mb-6 ml-6 list-decimal space-y-2"
            >
                {children}
            </ol>
        )
    }

    return (
        <ul className="mb-6 ml-6 list-disc space-y-2">
            {children}
        </ul>
    )
}

function renderLink(node: LexicalNode) {
    if (!node.url) {
        return renderChildren(node.children)
    }

    return (
        <a
            href={node.url}
            target={node.newTab ? '_blank' : undefined}
            rel={node.newTab ? 'noopener noreferrer' : undefined}
            className="font-medium text-[var(--theme-accent-600)] underline decoration-[var(--theme-accent-200)] underline-offset-4 transition-colors hover:text-[var(--theme-accent-700)] hover:decoration-[var(--theme-accent-400)]"
        >
            {renderChildren(node.children)}
        </a>
    )
}

function renderText(node: LexicalNode) {
    let content: ReactNode = node.text ?? ''

    const format =
        typeof node.format === 'number'
            ? node.format
            : 0

    if (format & 1) {
        content = <strong>{content}</strong>
    }

    if (format & 2) {
        content = <em>{content}</em>
    }

    if (format & 4) {
        content = <s>{content}</s>
    }

    if (format & 8) {
        content = <u>{content}</u>
    }

    if (format & 16) {
        content = (
            <code className="rounded bg-[var(--theme-elevation-100)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--theme-elevation-800)]">
                {content}
            </code>
        )
    }

    if (format & 32) {
        content = <sub>{content}</sub>
    }

    if (format & 64) {
        content = <sup>{content}</sup>
    }

    return content
}