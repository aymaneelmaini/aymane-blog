import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { cn } from '@/lib/utils'

interface MarkdownProps {
    content: string
    className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
    return (
        <ReactMarkdown
            className={cn(
                'prose prose-neutral dark:prose-invert max-w-none',
                // Headings
                'prose-headings:font-semibold prose-headings:tracking-tight',
                'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl',
                'prose-h2:mt-12 prose-h3:mt-8',
                // Paragraphs
                'prose-p:text-muted-foreground prose-p:leading-relaxed',
                // Links
                'prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
                // Code
                'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal',
                'prose-code:before:content-none prose-code:after:content-none',
                // Pre/Code blocks
                'prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-muted/50',
                // Lists
                'prose-li:text-muted-foreground',
                // Blockquotes
                'prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground',
                // Strong
                'prose-strong:text-foreground',
                className
            )}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeSlug]}
        >
            {content}
        </ReactMarkdown>
    )
}
