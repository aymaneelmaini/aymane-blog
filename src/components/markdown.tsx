import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

interface MarkdownProps {
    content: string
}

export function Markdown({ content }: MarkdownProps) {
    return (
        <div className="blog-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
