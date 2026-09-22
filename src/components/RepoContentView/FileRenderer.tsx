import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { detectLanguage, isImage, isMarkdown } from './utils';

/*
 * Dark code theme. Colours reference the CSS tokens from globals.css
 * (keyword orange, string yellow, number green, gutter grey).
 */
const INK = 'var(--color-ink)';
const KEYWORD = 'var(--color-code-keyword)';
const STRING = 'var(--color-code-string)';
const NUMBER = 'var(--color-code-number)';
const PUNCT = 'var(--color-ink-3)';
const COMMENT = 'var(--color-ink-4)';
const DELETED = 'var(--color-danger)';
const LINE_NUMBER = 'var(--color-code-gutter)';

const base: React.CSSProperties = {
    color: INK,
    background: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '12.5px',
    lineHeight: 1.7,
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: 4,
    hyphens: 'none',
};

const lightCodeTheme: { [key: string]: React.CSSProperties } = {
    'code[class*="language-"]': base,
    'pre[class*="language-"]': { ...base, margin: 0, overflow: 'auto' },
    comment: { color: COMMENT },
    prolog: { color: COMMENT },
    doctype: { color: COMMENT },
    cdata: { color: COMMENT },
    punctuation: { color: PUNCT },
    operator: { color: PUNCT },
    namespace: { opacity: 0.8 },
    keyword: { color: KEYWORD },
    atrule: { color: KEYWORD },
    important: { color: KEYWORD },
    boolean: { color: KEYWORD },
    tag: { color: KEYWORD },
    selector: { color: KEYWORD },
    string: { color: STRING },
    char: { color: STRING },
    'attr-value': { color: STRING },
    regex: { color: STRING },
    url: { color: STRING },
    inserted: { color: STRING },
    'template-string': { color: STRING },
    number: { color: NUMBER },
    constant: { color: NUMBER },
    symbol: { color: NUMBER },
    unit: { color: NUMBER },
    property: { color: INK },
    'attr-name': { color: INK },
    function: { color: INK },
    'class-name': { color: INK },
    builtin: { color: INK },
    variable: { color: INK },
    entity: { color: INK, cursor: 'help' },
    deleted: { color: DELETED },
    bold: { fontWeight: 600 },
    italic: { fontStyle: 'italic' },
};

const lineNumberStyle: React.CSSProperties = {
    color: LINE_NUMBER,
    minWidth: '2.75em',
    paddingRight: '16px',
    textAlign: 'right',
    userSelect: 'none',
};

const codeTagProps = { style: { fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' } };

/** Pulls the <code> element's className + text out of a markdown <pre>. */
function readFencedCode(children: React.ReactNode): { lang?: string; text: string } {
    const first = React.Children.toArray(children).find(React.isValidElement) as
        | React.ReactElement<{ className?: string; children?: React.ReactNode }>
        | undefined;
    if (!first) return { text: String(children ?? '') };
    const match = /language-([\w-]+)/.exec(first.props.className || '');
    return { lang: match ? match[1] : undefined, text: String(first.props.children ?? '').replace(/\n$/, '') };
}

export function renderFileContent(filePath: string, content: string, rawBase64: string | null) {
    // Image preview
    if (isImage(filePath) && rawBase64) {
        const ext = filePath.split('.').pop()!.toLowerCase();
        const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'ico' ? 'image/x-icon' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        const dataUri = `data:${mime};base64,${rawBase64}`;
        return (
            <div className="flex flex-col items-start gap-4 p-5 md:p-8">
                {/* Plain <img>: next/image needs fixed dimensions and can't optimise data URIs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUri} alt={filePath} className="h-auto max-w-full rounded-2xl border border-line bg-surface-2" />
                <a href={dataUri} download target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-full border border-line-strong px-3.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink">
                    Open raw image in new tab
                </a>
            </div>
        );
    }
    // Markdown rendering
    if (isMarkdown(filePath)) {
        return (
            <div className="markdown-body max-w-[860px] px-5 pb-16 pt-6 md:px-11 md:pt-10">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // Render paragraphs as divs to avoid invalid nesting like <pre> inside <p>
                        p({ children }: { children?: React.ReactNode }) {
                            return <div className="mb-4">{children}</div>;
                        },
                        // Fenced code blocks: <pre><code class="language-x">…</code></pre>
                        pre({ children }: { children?: React.ReactNode }) {
                            const { lang, text } = readFencedCode(children);
                            return (
                                <SyntaxHighlighter
                                    style={lightCodeTheme as any}
                                    language={lang}
                                    PreTag="pre"
                                    codeTagProps={codeTagProps}
                                    customStyle={{
                                        margin: '0 0 16px',
                                        background: 'var(--color-sunken)',
                                        padding: '14px 16px',
                                        fontSize: '12.5px',
                                        lineHeight: 1.7,
                                        borderRadius: '14px',
                                        border: '1px solid var(--color-line)',
                                        overflowX: 'auto',
                                    }}
                                    showLineNumbers
                                    lineNumberStyle={{ ...lineNumberStyle, minWidth: '2em', paddingRight: '14px' }}
                                >{text}</SyntaxHighlighter>
                            );
                        },
                        // Anything left is inline code
                        code({ children }: { children?: React.ReactNode }) {
                            return (
                                <code className="rounded-md border border-line bg-surface-2 px-1.5 py-px font-mono text-[0.85em] text-ink">
                                    {children}
                                </code>
                            );
                        },
                        a({ children, href, node, ...rest }: any) {
                            return <a href={href} className="text-accent hover:underline" {...rest}>{children}</a>;
                        },
                        img({ src, alt }: any) {
                            // eslint-disable-next-line @next/next/no-img-element
                            return <img src={src} alt={alt ?? ''} className="h-auto max-w-full rounded-xl" />;
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
            style={lightCodeTheme as any}
            codeTagProps={codeTagProps}
            customStyle={{ margin: 0, background: 'var(--color-surface)', fontSize: '12.5px', lineHeight: 1.7, padding: '16px 20px 24px 8px' }}
            wrapLongLines
            showLineNumbers
            lineNumberStyle={lineNumberStyle}
        >{content}</SyntaxHighlighter>
    );
}
