/*
 * Test script to demonstrate the Artifacts feature detection patterns
 */

// Simple artifact detection patterns for testing
const ARTIFACT_PATTERNS = [
  {
    regex: /```html\s*\n([\s\S]*?)\n```/gi,
    type: 'html',
    getTitle: (content) => 'HTML Document'
  },
  {
    regex: /```svg\s*\n([\s\S]*?)\n```/gi,
    type: 'svg', 
    getTitle: (content) => 'SVG Image'
  },
  {
    regex: /```python\s*\n([\s\S]*?)\n```/gi,
    type: 'code',
    language: 'python',
    getTitle: (content) => 'Python Code'
  },
  {
    regex: /```json\s*\n([\s\S]*?)\n```/gi,
    type: 'json',
    getTitle: (content) => 'JSON Data'
  }
];

function detectArtifacts(content) {
  const artifacts = [];
  let processedContent = content;
  
  for (const pattern of ARTIFACT_PATTERNS) {
    let match;
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(processedContent)) !== null) {
      const codeContent = match[1];
      
      if (codeContent.trim().length > 50) { // Minimum size check
        const artifact = {
          id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: pattern.type,
          title: pattern.getTitle(codeContent),
          content: codeContent,
          language: pattern.language,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        artifacts.push(artifact);
        processedContent = processedContent.replace(match[0], '');
      }
    }
  }
  
  return {
    content: processedContent.trim(),
    artifacts
  };
}

// Test message content with various artifacts
const testMessage = `
I'll help you create some interactive content! Here are several examples:

## Interactive HTML Page

Here's a simple interactive page:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Interactive Demo</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        .button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        .button:hover { background: #0056b3; }
        .output { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Welcome to Libre WebUI Artifacts!</h1>
    <p>This is an interactive HTML artifact. Try the button below:</p>
    <button class="button" onclick="showMessage()">Click Me!</button>
    <button class="button" onclick="changeColor()">Change Theme</button>
    <div id="output" class="output">Click a button to see the magic!</div>
    
    <script>
        function showMessage() {
            document.getElementById('output').innerHTML = 
                '<h3>🎉 Artifacts are working!</h3><p>This content was generated dynamically.</p>';
        }
        
        function changeColor() {
            const colors = ['#e3f2fd', '#fff3e0', '#f3e5f5', '#e8f5e8'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.backgroundColor = randomColor;
            document.getElementById('output').innerHTML = 
                '<p>Theme changed! Background color: ' + randomColor + '</p>';
        }
    </script>
</body>
</html>
\`\`\`

## Animated SVG Logo

And here's an animated SVG graphic:

\`\`\`svg
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#007bff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00d4aa;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Animated circles -->
    <circle cx="50" cy="100" r="20" fill="url(#grad1)">
        <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <circle cx="150" cy="100" r="25" fill="#007bff">
        <animate attributeName="r" values="25;35;25" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="100;80;100" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    
    <circle cx="250" cy="100" r="20" fill="#00d4aa">
        <animate attributeName="r" values="20;30;20" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Animated text -->
    <text x="150" y="50" text-anchor="middle" fill="#333" font-family="Arial, sans-serif" font-size="20" font-weight="bold">
        Libre WebUI
        <animate attributeName="fill" values="#333;#007bff;#333" dur="4s" repeatCount="indefinite"/>
    </text>
    
    <text x="150" y="170" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="14">
        Artifacts in Action
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
    </text>
</svg>
\`\`\`

## Python Data Analysis Script

Here's a useful Python script:

\`\`\`python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

def analyze_chat_data(messages_data):
    """
    Analyze chat session data and generate insights
    """
    # Convert to DataFrame
    df = pd.DataFrame(messages_data)
    
    # Basic statistics
    stats = {
        'total_messages': len(df),
        'unique_users': df['role'].nunique() if 'role' in df.columns else 0,
        'analysis_timestamp': datetime.now().isoformat()
    }
    
    # Messages by role
    if 'role' in df.columns:
        role_counts = df['role'].value_counts().to_dict()
        stats['messages_by_role'] = role_counts
    
    # Time-based analysis
    if 'timestamp' in df.columns:
        df['datetime'] = pd.to_datetime(df['timestamp'], unit='ms')
        stats['date_range'] = {
            'start': df['datetime'].min().isoformat(),
            'end': df['datetime'].max().isoformat()
        }
        
        # Messages per hour
        df['hour'] = df['datetime'].dt.hour
        hourly_dist = df['hour'].value_counts().sort_index().to_dict()
        stats['hourly_distribution'] = hourly_dist
    
    # Content analysis
    if 'content' in df.columns:
        df['message_length'] = df['content'].str.len()
        stats['content_stats'] = {
            'avg_message_length': df['message_length'].mean(),
            'max_message_length': df['message_length'].max(),
            'min_message_length': df['message_length'].min()
        }
    
    return stats

# Example usage
sample_data = [
    {'role': 'user', 'content': 'Hello, can you help me?', 'timestamp': 1704067200000},
    {'role': 'assistant', 'content': 'Of course! I\\'d be happy to help.', 'timestamp': 1704067205000},
    {'role': 'user', 'content': 'Create an artifact example', 'timestamp': 1704067300000}
]

# Analyze the data
results = analyze_chat_data(sample_data)
print(json.dumps(results, indent=2))
\`\`\`

## Configuration JSON

Finally, here's a sample configuration:

\`\`\`json
{
    "application": {
        "name": "Libre WebUI",
        "version": "1.0.0",
        "description": "Privacy-first AI chat interface with artifact support"
    },
    "features": {
        "artifacts": {
            "enabled": true,
            "supported_types": ["html", "svg", "python", "javascript", "json"],
            "security": {
                "sandboxed_rendering": true,
                "content_validation": true,
                "download_sanitization": true
            }
        },
        "multimodal": true,
        "plugins": true,
        "themes": ["light", "dark", "auto"]
    },
    "artifacts": {
        "auto_detection": {
            "min_code_lines": 5,
            "min_content_length": 100,
            "language_patterns": {
                "html": "/<[^>]+>/",
                "svg": "/<svg[^>]*>/",
                "python": "/def |class |import /",
                "javascript": "/function |const |let /"
            }
        },
        "rendering": {
            "iframe_sandbox": "allow-scripts allow-same-origin",
            "max_file_size": "10MB",
            "timeout": "30s"
        }
    },
    "security": {
        "rate_limiting": {
            "enabled": true,
            "requests_per_minute": 60
        },
        "content_filtering": {
            "enabled": true,
            "block_patterns": ["<script>alert", "javascript:", "data:"]
        }
    }
}
\`\`\`

All of these code blocks will be automatically converted into interactive artifacts when displayed in the chat! You can interact with the HTML page, see the SVG animations, copy the Python code, and view the formatted JSON configuration.
`;

// Test the parser
console.log('Testing Artifact Parser...\n');

const result = detectArtifacts(testMessage);

console.log('Parsed Content:');
console.log('================');
console.log(result.content.substring(0, 200) + '...');
console.log('\n');

console.log('Detected Artifacts:');
console.log('===================');
result.artifacts.forEach((artifact, index) => {
  console.log(`${index + 1}. ${artifact.title} (${artifact.type})`);
  console.log(`   ID: ${artifact.id}`);
  console.log(`   Language: ${artifact.language || 'N/A'}`);
  console.log(`   Content length: ${artifact.content.length} characters`);
  console.log(`   Content preview: ${artifact.content.substring(0, 100)}...`);
  console.log('');
});

console.log(`Total artifacts detected: ${result.artifacts.length}`);
