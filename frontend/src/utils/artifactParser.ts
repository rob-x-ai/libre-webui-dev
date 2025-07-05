/*
 * Libre WebUI
 * Copyright (C) 2025 Kroonen AI, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Artifact } from '@/types';

export interface ArtifactParseResult {
  content: string; // Message content with artifacts removed
  artifacts: Artifact[];
}

// Patterns to detect artifacts in message content
const ARTIFACT_PATTERNS = [
  // HTML artifacts
  {
    regex: /```html\s*\n([\s\S]*?)\n```/gi,
    type: 'html' as const,
    getTitle: (content: string) => extractTitle(content) || 'HTML Document',
  },

  // SVG artifacts
  {
    regex: /```svg\s*\n([\s\S]*?)\n```/gi,
    type: 'svg' as const,
    getTitle: (_content: string) => 'SVG Image',
  },

  // React/JSX artifacts
  {
    regex: /```(?:react|jsx)\s*\n([\s\S]*?)\n```/gi,
    type: 'react' as const,
    getTitle: (content: string) =>
      extractComponentName(content) || 'React Component',
  },

  // JSON artifacts
  {
    regex: /```json\s*\n([\s\S]*?)\n```/gi,
    type: 'json' as const,
    getTitle: (_content: string) => 'JSON Data',
  },

  // Python artifacts
  {
    regex: /```python\s*\n([\s\S]*?)\n```/gi,
    type: 'code' as const,
    language: 'python',
    getTitle: (content: string) => extractPythonTitle(content) || 'Python Code',
  },

  // JavaScript artifacts
  {
    regex: /```(?:javascript|js)\s*\n([\s\S]*?)\n```/gi,
    type: 'code' as const,
    language: 'javascript',
    getTitle: (content: string) => extractJSTitle(content) || 'JavaScript Code',
  },

  // CSS artifacts
  {
    regex: /```css\s*\n([\s\S]*?)\n```/gi,
    type: 'code' as const,
    language: 'css',
    getTitle: (_content: string) => 'CSS Styles',
  },

  // Generic code artifacts
  {
    regex: /```(\w+)\s*\n([\s\S]*?)\n```/gi,
    type: 'code' as const,
    getTitle: (content: string, language: string) =>
      `${language.toUpperCase()} Code`,
  },
];

// Artifact marker patterns (explicit artifact declarations)
const ARTIFACT_MARKERS = [
  // <artifact type="html" title="My Page">content</artifact>
  {
    regex:
      /<artifact\s+type="([^"]+)"\s+title="([^"]+)"[^>]*>([\s\S]*?)<\/artifact>/gi,
    extract: (match: RegExpExecArray) => ({
      type: match[1] as Artifact['type'],
      title: match[2],
      content: match[3].trim(),
    }),
  },

  // <artifact type="html">content</artifact>
  {
    regex: /<artifact\s+type="([^"]+)"[^>]*>([\s\S]*?)<\/artifact>/gi,
    extract: (match: RegExpExecArray) => ({
      type: match[1] as Artifact['type'],
      title: `${match[1].toUpperCase()} Artifact`,
      content: match[2].trim(),
    }),
  },
];

/**
 * Extract title from HTML content
 */
function extractTitle(htmlContent: string): string | null {
  const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].replace(/<[^>]*>/g, '').trim();
  }

  return null;
}

/**
 * Extract component name from React/JSX content
 */
function extractComponentName(jsxContent: string): string | null {
  // Look for function components
  const functionMatch = jsxContent.match(/(?:function|const)\s+(\w+)/);
  if (functionMatch) {
    return functionMatch[1];
  }

  // Look for class components
  const classMatch = jsxContent.match(/class\s+(\w+)/);
  if (classMatch) {
    return classMatch[1];
  }

  return null;
}

/**
 * Extract title from Python code
 */
function extractPythonTitle(pythonContent: string): string | null {
  // Look for main function
  if (pythonContent.includes('def main(')) {
    return 'Python Script';
  }

  // Look for class definition
  const classMatch = pythonContent.match(/class\s+(\w+)/);
  if (classMatch) {
    return `${classMatch[1]} Class`;
  }

  // Look for first function
  const funcMatch = pythonContent.match(/def\s+(\w+)/);
  if (funcMatch && funcMatch[1] !== '__init__') {
    return `${funcMatch[1]} Function`;
  }

  return null;
}

/**
 * Extract title from JavaScript code
 */
function extractJSTitle(jsContent: string): string | null {
  // Look for function declarations
  const funcMatch = jsContent.match(/function\s+(\w+)/);
  if (funcMatch) {
    return `${funcMatch[1]} Function`;
  }

  // Look for const/let function assignments
  const constMatch = jsContent.match(/(?:const|let)\s+(\w+)\s*=/);
  if (constMatch) {
    return constMatch[1];
  }

  return null;
}

/**
 * Check if content should be treated as an artifact
 */
function shouldBeArtifact(content: string, type: string): boolean {
  // HTML should be an artifact if it contains actual HTML elements and is substantial
  if (type === 'html') {
    return /<[^>]+>/.test(content) && content.trim().length > 200;
  }

  // SVG should be an artifact if it contains SVG elements
  if (type === 'svg') {
    return /<svg[^>]*>/.test(content);
  }

  // React/JSX should be an artifact if it contains JSX elements
  if (type === 'react') {
    return /<[A-Z][^>]*>/.test(content) || /return\s*\(/.test(content);
  }

  // JSON should be an artifact if it's valid JSON and reasonably sized
  if (type === 'json') {
    try {
      JSON.parse(content);
      return content.trim().length > 100;
    } catch {
      return false;
    }
  }

  // Code should be an artifact if it's substantial (much higher thresholds)
  if (type === 'code') {
    const lines = content.split('\n').length;
    const chars = content.trim().length;

    // Must be either very long (500+ chars) or have many lines (15+)
    // AND have some complexity indicators
    const hasComplexity =
      /function|class|def |import |from |const |let |var |if |for |while |try |catch/.test(
        content
      );

    return (chars > 500 || lines > 15) && hasComplexity;
  }

  return false;
}

/**
 * Parse message content and extract artifacts
 */
export function parseArtifacts(content: string): ArtifactParseResult {
  const artifacts: Artifact[] = [];
  let processedContent = content;

  // First, check for explicit artifact markers
  for (const marker of ARTIFACT_MARKERS) {
    let match;
    while ((match = marker.regex.exec(processedContent)) !== null) {
      const extracted = marker.extract(match);

      if (shouldBeArtifact(extracted.content, extracted.type)) {
        const artifact: Artifact = {
          id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: extracted.type,
          title: extracted.title,
          content: extracted.content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        artifacts.push(artifact);
        processedContent = processedContent.replace(match[0], '');
      }
    }
  }

  // Then check for code block patterns
  for (const pattern of ARTIFACT_PATTERNS) {
    let match;
    pattern.regex.lastIndex = 0; // Reset regex

    while ((match = pattern.regex.exec(processedContent)) !== null) {
      const codeContent = match[1] || match[2]; // Handle different capture groups
      const language =
        pattern.language || (match[1] && match[2] ? match[1] : undefined);

      if (shouldBeArtifact(codeContent, pattern.type)) {
        const artifact: Artifact = {
          id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: pattern.type,
          title: pattern.getTitle(codeContent, language || 'code'),
          content: codeContent,
          language,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        artifacts.push(artifact);
        processedContent = processedContent.replace(match[0], '');
      }
    }
  }

  return {
    content: processedContent.trim(),
    artifacts,
  };
}

/**
 * Check if a message might contain artifacts
 */
export function hasArtifacts(content: string): boolean {
  // Check for explicit artifact markers
  for (const marker of ARTIFACT_MARKERS) {
    if (marker.regex.test(content)) {
      return true;
    }
  }

  // Check for code blocks that might be artifacts
  for (const pattern of ARTIFACT_PATTERNS) {
    pattern.regex.lastIndex = 0;
    const match = pattern.regex.exec(content);
    if (match) {
      const codeContent = match[1] || match[2];
      if (shouldBeArtifact(codeContent, pattern.type)) {
        return true;
      }
    }
  }

  return false;
}
