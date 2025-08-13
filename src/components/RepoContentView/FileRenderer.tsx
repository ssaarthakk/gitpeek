import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// @ts-ignore - optional peer for tables/task lists
import remarkGfm from 'remark-gfm';
import { detectLanguage, isImage, isMarkdown } from './utils';

const githubDarkTheme = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: 'transparent',
        color: '#c9d1d9'
    },
    'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        background: 'transparent',
        color: '#c9d1d9'
    },
    comment: { color: '#8b949e' },
    punctuation: { color: '#c9d1d9' },
    property: { color: '#d2a8ff' },
    tag: { color: '#7ee787' },
    boolean: { color: '#79c0ff' },
    number: { color: '#79c0ff' },
    selector: { color: '#ffa657' },
    'attr-name': { color: '#ffa657' },
    string: { color: '#a5d6ff' },
    char: { color: '#a5d6ff' },
    builtin: { color: '#ffa657' },
    function: { color: '#d2a8ff' },
    keyword: { color: '#ff7b72' }
};

export function renderFileContent(filePath: string, content: string, rawBase64: string | null) {
    // Image preview
    if (isImage(filePath) && rawBase64) {
        const ext = filePath.split('.').pop()!.toLowerCase();
        const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'ico' ? 'image/x-icon' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        const dataUri = `data:${mime};base64,${rawBase64}`;
        return (
            <div className="p-6 flex flex-col items-start gap-4">
                <img src={dataUri} alt={filePath} className="max-w-full h-auto rounded-lg ring-1 ring-white/10 bg-white/5" />
                <a href={dataUri} download target="_blank" rel="noreferrer" className="text-[11px] text-sky-400 hover:underline">Open raw image in new tab</a>
            </div>
        );
    }
    // Markdown rendering
    if (isMarkdown(filePath)) {
        return (
            <div className="markdown-body max-w-none p-6 pb-16 !bg-transparent">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }: { node: any; inline?: boolean; className?: string; children: any }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const lang = match ? match[1] : undefined;
                            if (inline) {
                                return <code className="px-1 py-[2px] rounded-md bg-[#161b22] border border-[#30363d] text-[12px]" {...props}>{children}</code>;
                            }
                            return (
                                <SyntaxHighlighter
                                    style={githubDarkTheme as any}
                                    language={lang}
                                    PreTag="div"
                                    customStyle={{ margin: '0 0 16px', background: '#161b22', padding: '16px 18px', fontSize: '13px', borderRadius: '6px', border: '1px solid #30363d' }}
                                    showLineNumbers
                                    lineNumberStyle={{ color: '#6e7681', fontSize: '11px', paddingRight: '12px' }}
                                >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                            );
                        },
                        a({children, href, ...rest}: any){
                            return <a href={href} className="text-sky-400 hover:underline" {...rest}>{children}</a>;
                        },
                        img({src, alt}: any){
                            return <img src={src} alt={alt} className="max-w-full h-auto rounded-md border border-[#30363d] bg-[#0d1117]" />;
                        }
                    }}
                >{content}</ReactMarkdown>
            </div>
        );
    }
    // Code / text fallback
    const language = detectLanguage(filePath);
    return (
        <SyntaxHighlighter
            language={language}
            style={githubDarkTheme as any}
            customStyle={{ margin: 0, background: 'transparent', fontSize: '12px', padding: '18px 24px' }}
            wrapLongLines
            showLineNumbers
            lineNumberStyle={{ color: '#6e7781', fontSize: '11px', paddingRight: '12px' }}
        >{content}</SyntaxHighlighter>
    );
}
