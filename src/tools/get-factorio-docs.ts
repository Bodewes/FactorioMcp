import axios from 'axios';
import { FactorioTool } from './types.js';
import { FactorioRconClient } from '../rcon/client.js';

const API_BASE_URL = 'https://lua-api.factorio.com/stable';
const WIKI_BASE_URL = 'https://wiki.factorio.com';

const inputSchema = {
  type: 'object' as const,
  properties: {
    topic: {
      type: 'string',
      description: 'The topic to look up: class name (e.g., "LuaForce", "LuaFlowStatistics"), concept, event, or wiki page name (e.g., "Tutorial:Modding_tutorial")',
    },
    source: {
      type: 'string',
      enum: ['api', 'wiki'],
      description: 'Source to search: "api" for Lua API docs (default), "wiki" for Factorio wiki',
    },
  },
  required: ['topic'] as string[],
};

async function handler(_rconClient: FactorioRconClient, args: Record<string, unknown>): Promise<string> {
  const topic = args.topic as string;
  const source = (args.source as 'api' | 'wiki') || 'api';
  
  let url: string;
  
  if (source === 'wiki') {
    // Wiki lookup
    if (topic.toLowerCase() === 'index' || topic.toLowerCase() === 'main') {
      url = WIKI_BASE_URL;
    } else {
      // Wiki pages can be accessed directly by name
      url = `${WIKI_BASE_URL}/${topic}`;
    }
  } else {
    // API documentation lookup
    if (topic.toLowerCase() === 'index') {
      url = `${API_BASE_URL}/index-runtime.html`;
    } else if (topic.startsWith('Lua')) {
      // Class lookup (e.g., LuaForce, LuaGameScript)
      url = `${API_BASE_URL}/classes/${topic}.html`;
    } else if (topic === 'defines') {
      url = `${API_BASE_URL}/defines.html`;
    } else if (topic === 'concepts') {
      url = `${API_BASE_URL}/concepts.html`;
    } else if (topic === 'events') {
      url = `${API_BASE_URL}/events.html`;
    } else {
      // Try as a concept first, fall back to searching in classes
      url = `${API_BASE_URL}/concepts/${topic}.html`;
    }
  }

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'FactorioMCP/1.0',
      },
    });

    // Extract the body content (simplified - we return the full HTML)
    // In a real implementation, you might want to parse and clean the HTML
    const html = response.data;
    
    // Try to extract just the main content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const content = bodyMatch ? bodyMatch[1] : html;
    
    // Remove script tags
    const cleanContent = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Return first 10000 characters to avoid overwhelming output
    const result = cleanContent.substring(0, 10000);
    
    return `Documentation for ${topic}:\nURL: ${url}\n\n${result}${cleanContent.length > 10000 ? `\n\n... (truncated, showing first 10000 of ${cleanContent.length} characters)` : ''}`;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        // Try alternative URL patterns
        const alternatives: string[] = [];
        
        if (source === 'api') {
          alternatives.push(
            `${API_BASE_URL}/classes/Lua${topic}.html`,
            `${API_BASE_URL}/concepts/${topic}.html`,
            `${API_BASE_URL}/events.html#${topic}`,
          );
        } else {
          // For wiki, try with underscores instead of spaces
          const topicWithUnderscores = topic.replace(/ /g, '_');
          if (topicWithUnderscores !== topic) {
            alternatives.push(`${WIKI_BASE_URL}/${topicWithUnderscores}`);
          }
        }
        
        for (const altUrl of alternatives) {
          try {
            const response = await axios.get(altUrl, {
              timeout: 10000,
              headers: {
                'User-Agent': 'FactorioMCP/1.0',
              },
            });
            
            const html = response.data;
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
            const content = bodyMatch ? bodyMatch[1] : html;
            const cleanContent = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            const result = cleanContent.substring(0, 10000);
            
            return `Documentation for ${topic}:\nURL: ${altUrl}\n\n${result}${cleanContent.length > 10000 ? `\n\n... (truncated, showing first 10000 of ${cleanContent.length} characters)` : ''}`;
          } catch {
            // Continue to next alternative
          }
        }
        
        if (source === 'api') {
          return `Documentation not found for "${topic}".\n\nTried URLs:\n- ${url}\n${alternatives.map(u => `- ${u}`).join('\n')}\n\nSuggestions:\n- For classes, use the full name (e.g., "LuaForce", "LuaFlowStatistics")\n- For other topics, try "defines", "concepts", "events", or "index"\n- For wiki pages, set source to "wiki"\n\nAPI Root: ${API_BASE_URL}/index-runtime.html\nWiki Root: ${WIKI_BASE_URL}`;
        } else {
          return `Wiki page not found for "${topic}".\n\nTried URLs:\n- ${url}\n${alternatives.map(u => `- ${u}`).join('\n')}\n\nSuggestion: Try searching the wiki at ${WIKI_BASE_URL}`;
        }
      }
      return `Error fetching documentation: ${error.message}`;
    }
    throw error;
  }
}

export const getFactorioDocsTool: FactorioTool = {
  definition: {
    name: 'get_factorio_docs',
    description: 'Fetch Factorio documentation from the Lua API docs or wiki. Use this to look up Factorio APIs, game concepts, or modding tutorials. Examples: "LuaFlowStatistics", "defines", "Tutorial:Modding_tutorial" (with source="wiki")',
    inputSchema: inputSchema,
  },
  handler,
};
