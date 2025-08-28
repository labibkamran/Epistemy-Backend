// Utility: safely extract JSON from LLM outputs that may be strings or objects
// Handles cases where the provider returns an object (already parsed),
// a JSON string, or a string with surrounding prose.

function extractJsonSubstring(str) {
    const first = str.indexOf('{');
    const last = str.lastIndexOf('}');
    if (first === -1 || last === -1 || last <= first) return str;
    const candidate = str.slice(first, last + 1);
    return candidate;
}

function extractJsonByExpectation(str, expect = 'object') {
    const s = String(str);
    if (expect === 'array') {
        const start = s.indexOf('[');
        if (start === -1) return s;
        let depth = 0;
        for (let i = start; i < s.length; i++) {
            const ch = s[i];
            if (ch === '[') depth++;
            else if (ch === ']') {
                depth--;
                if (depth === 0) return s.slice(start, i + 1);
            }
        }
        return s.slice(start); 
    }
    const start = s.indexOf('{');
    if (start === -1) return s;
    let depth = 0;
    for (let i = start; i < s.length; i++) {
        const ch = s[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) return s.slice(start, i + 1);
        }
    }
    return s.slice(start);
}

function aiMessageToString(raw) {
    if (!raw || typeof raw !== 'object') return String(raw);
        // Try direct and nested properties
        const toJson = typeof raw.toJSON === 'function' ? raw.toJSON() : null;
        const content =
                raw.content ??
                (raw.lc_kwargs && raw.lc_kwargs.content) ??
                (raw.kwargs && raw.kwargs.content) ??
                (raw.additional_kwargs && raw.additional_kwargs.content) ??
                (toJson && (toJson.content ?? toJson?.lc_kwargs?.content ?? toJson?.kwargs?.content));
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content.map(part => {
            if (!part) return '';
            if (typeof part === 'string') return part;
            if (typeof part.text === 'string') return part.text;
            if (typeof part.content === 'string') return part.content;
            return '';
        }).join('');
    }
        try {
                if (toJson) return JSON.stringify(toJson);
                return JSON.stringify(content ?? raw);
        } catch {
                return String(raw);
        }
}

function balanceAndCloseJson(text) {
    let s = String(text);
    s = s.replace(/,(\s*[}\]])/g, '$1');
    const unescapedQuotes = (s.match(/(?<!\\)"/g) || []).length;
    if (unescapedQuotes % 2 === 1) {
        s += '"';
    }
    const opensCurly = (s.match(/{/g) || []).length;
    const closesCurly = (s.match(/}/g) || []).length;
    const opensSquare = (s.match(/\[/g) || []).length;
    const closesSquare = (s.match(/\]/g) || []).length;
    if (closesCurly < opensCurly) s += '}'.repeat(opensCurly - closesCurly);
    if (closesSquare < opensSquare) s += ']'.repeat(opensSquare - closesSquare);
    return s;
}

async function safeJsonFromLLM(raw, stringOutputParser, opts = { expect: 'object' }) {
    let textCandidate;
    try {
        if (raw && typeof raw === 'object' && (raw.content || (raw.lc_kwargs && raw.lc_kwargs.content))) {
            textCandidate = aiMessageToString(raw);
        } else if (stringOutputParser) {
            textCandidate = await stringOutputParser.parse(raw);
        } else {
            textCandidate = String(raw);
        }
    } catch {
        textCandidate = aiMessageToString(raw);
    }

    if (typeof textCandidate !== 'string') {
        const objText = aiMessageToString(textCandidate);
        if (objText && objText !== '[object Object]' && objText !== '[object AIMessage]') {
            try { return JSON.parse(objText); } catch { /* fall through */ }
        }
        try { return JSON.parse(String(textCandidate)); } catch { /* fall through */ }
    }

        const text = String(textCandidate);
    try {
            return JSON.parse(text);
    } catch (_e) {
        try {
                const primary = extractJsonByExpectation(text, opts?.expect || 'object');
                try {
                    return JSON.parse(primary);
                } catch (_e2) {
                    const trimmed = extractJsonSubstring(text);
                    try {
                        return JSON.parse(trimmed);
                    } catch (_e3) {
                        const repaired = balanceAndCloseJson(primary);
                        return JSON.parse(repaired);
                    }
                }
        } catch (__e) {
            throw new Error(`Failed to parse LLM JSON: ${__e.message}. Raw: ${text.slice(0, 200)}...`);
        }
    }
}

    module.exports = { safeJsonFromLLM };
