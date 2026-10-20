import React from 'react';

interface BlogContentProps {
  content: string;
}

// Renders inline markdown emphasis inside a text run.
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[var(--color-text)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

// Renders blog body with basic markdown headings, lists, and paragraphs.
export function BlogContent({ content }: BlogContentProps) {
  const blocks = content.replace(/\r\n/g, '\n').split(/\n{2,}/);

  return (
    <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[var(--color-muted)]">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('### ')) {
          return (
            <h2
              key={index}
              className="pt-4 text-2xl font-bold tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {trimmed.replace(/^###\s+/, '')}
            </h2>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="pt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        const listLines = trimmed.split('\n').filter((line) => /^\s*[-*]\s+/.test(line));
        if (listLines.length > 0 && listLines.length === trimmed.split('\n').filter(Boolean).length) {
          return (
            <ul key={index} className="space-y-2 pl-1">
              {listLines.map((line, li) => (
                <li key={li} className="flex items-start gap-2.5">
                  <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                  <span>{renderInline(line.replace(/^\s*[-*]\s+/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="whitespace-pre-line">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
