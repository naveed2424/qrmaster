import { QRToolSEOArticle } from '../types/qr';
import { TOOL_SEO_GUIDES_PART1 } from './toolSeoGuidesPart1';

export const TOOL_SEO_GUIDES: Record<string, QRToolSEOArticle> = {
  ...TOOL_SEO_GUIDES_PART1,
};

export function getToolSeoGuide(toolId: string): QRToolSEOArticle | undefined {
  return TOOL_SEO_GUIDES[toolId];
}
