export function detectLanguage(filePath: string | null): string | undefined {
    if (!filePath) return undefined;
    const name = filePath.split('/').pop() || '';
    const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
    if (/^dockerfile$/i.test(name)) return 'docker';
    switch (ext) {
        case 'ts':
        case 'tsx': return 'typescript';
        case 'js':
        case 'jsx': return 'javascript';
        case 'c': return 'c';
        case 'h': return 'c';
        case 'cpp':
        case 'cc':
        case 'hpp': return 'cpp';
        case 'cs': return 'csharp';
        case 'java': return 'java';
        case 'kt':
        case 'kts': return 'kotlin';
        case 'swift': return 'swift';
        case 'py': return 'python';
        case 'rs': return 'rust';
        case 'go': return 'go';
        case 'rb': return 'ruby';
        case 'php': return 'php';
        case 'scala': return 'scala';
        case 'sql': return 'sql';
        case 'sh':
        case 'bash': return 'bash';
        case 'md':
        case 'markdown': return 'markdown';
        case 'json': return 'json';
        case 'yml':
        case 'yaml': return 'yaml';
        case 'css': return 'css';
        case 'scss': return 'scss';
        case 'less': return 'less';
        case 'html':
        case 'htm': return 'html';
        case 'xml': return 'xml';
        case 'ini':
        case 'env': return 'properties';
        case 'toml': return 'toml';
        case 'prisma': return 'prisma';
        case 'graphql':
        case 'gql': return 'graphql';
        case 'vue': return 'vue';
        case 'svelte': return 'svelte';
        default: return undefined;
    }
}

export function isImage(filePath: string) {
    return /(\.png|\.jpe?g|\.gif|\.webp|\.bmp|\.svg|\.ico)$/i.test(filePath);
}

export function isMarkdown(filePath: string) {
    return /(README|readme)\.(md|markdown)$/.test(filePath) || /\.(md|markdown)$/.test(filePath);
}
