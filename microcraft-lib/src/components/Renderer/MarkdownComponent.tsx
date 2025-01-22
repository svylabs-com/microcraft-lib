import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownProps {
  content: string;
}

const MarkdownComponent: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div className="prose max-w-none prose-slate dark:prose-invert mx-auto p-4 border rounded-lg shadow-lg">
      <ReactMarkdown
        components={{
            code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={materialDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded ${className}`}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownComponent;
