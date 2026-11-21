import { QRToolSEOArticle } from '../types/qr';
import { TOOL_SEO_GUIDES_PART1 } from './toolSeoGuidesPart1';
import { TOOL_SEO_GUIDES_PART2 } from './toolSeoGuidesPart2';

export const TOOL_SEO_GUIDES: Record<string, QRToolSEOArticle> = {
  ...TOOL_SEO_GUIDES_PART1,
  ...TOOL_SEO_GUIDES_PART2,
};

export function getToolSeoGuide(toolId: string): QRToolSEOArticle | undefined {
  return TOOL_SEO_GUIDES[toolId];
}
