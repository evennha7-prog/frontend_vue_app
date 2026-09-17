/**
 * Safe, lightweight markdown renderer for Notes Tok Vue UI.
 * Handles headings, bold/italic, lists, blockquotes, inline code, and code blocks with HTML escaping.
 * 
 * @param input Raw markdown text entered by the user
 * @returns Sanitized, styled HTML string ready for v-html rendering
 */
export function renderMarkdown(input?: string | null): string {
  if (!input) return '<p class="text-slate-500 italic">No content written yet.</p>'

  // 1. HTML escape to prevent Cross-Site Scripting (XSS)
  let html = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. Code blocks (```lang ... ```)
  html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
    return `<pre class="p-3 my-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto"><code>${code.trim()}</code></pre>`
  })

  // 3. Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-mono">$1</code>')

  // 4. Headings (###, ##, #)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-100 mt-4 mb-1.5">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-white mt-6 mb-3 pb-1 border-b border-slate-800">$1</h1>')

  // 5. Blockquotes (> ...)
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-3 py-1 my-2 text-slate-400 italic bg-indigo-500/5 rounded-r-lg">$1</blockquote>')

  // 6. Checklists (- [x], - [ ])
  html = html.replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 text-sm text-slate-300 my-1"><span class="text-emerald-400 font-bold">☑</span> <span class="line-through text-slate-500">$1</span></div>')
  html = html.replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 text-sm text-slate-300 my-1"><span class="text-slate-500">☐</span> <span>$1</span></div>')

  // 7. Bullet lists (- or *)
  html = html.replace(/^[-\*] (.*$)/gim, '<li class="ml-4 list-disc text-sm text-slate-300 my-0.5">$1</li>')

  // 8. Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200">$1</em>')

  // 9. Paragraph breaks (preserve linebreaks outside tags)
  html = html.replace(/\n\n+/g, '</p><p class="my-2 leading-relaxed text-slate-300 text-sm">')
  html = html.replace(/\n/g, '<br />')

  return `<div class="space-y-1">${html}</div>`
}
