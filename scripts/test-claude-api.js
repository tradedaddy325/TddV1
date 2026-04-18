#!/usr/bin/env node

/**
 * Test Claude API Key
 * Verifies the ANTHROPIC_API_KEY environment variable works
 */

async function testClaudeAPI() {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('[ERROR] ANTHROPIC_API_KEY or CLAUDE_API_KEY environment variable not set');
    process.exit(1);
  }

  console.log('[v0] Testing Claude API with key:', apiKey.substring(0, 10) + '...');
  console.log('[v0] Making test API call...');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Say "API key is valid" if you can read this.',
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[ERROR] API Error:', data.error?.message || 'Unknown error');
      console.error('[ERROR] Status:', response.status);
      process.exit(1);
    }

    const reply = data.content?.[0]?.text || '';
    console.log('[v0] API Response:', reply);
    console.log('[SUCCESS] Claude API key is valid and working!');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Test failed:', error.message);
    process.exit(1);
  }
}

testClaudeAPI();
