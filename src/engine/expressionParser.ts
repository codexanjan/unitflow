/**
 * Safe Math Expression Evaluator
 * AST Recursive Descent Parser without eval() or new Function().
 * Handles arithmetic (+, -, *, /, ^, %), parentheses, unary minus/plus, and scientific notation.
 */

export interface EvaluationResult {
  success: boolean;
  value?: number;
  error?: string;
  isExpression?: boolean;
}

type TokenType = 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

export function evaluateExpression(rawInput: string): EvaluationResult {
  if (!rawInput || rawInput.trim() === '') {
    return { success: false, error: 'Input is empty' };
  }

  const input = rawInput.trim();

  // Normalize common math symbols (×, ÷, *)
  const normalized = input
    .replace(/[×✕xX]/g, () => '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  // Check if it is a simple plain number
  const trimmed = normalized.replace(/\s+/g, '');
  if (/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (!Number.isNaN(num) && Number.isFinite(num)) {
      return { success: true, value: num, isExpression: false };
    }
  }

  // Tokenize
  const tokens: Token[] = [];
  let i = 0;

  while (i < normalized.length) {
    const char = normalized[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number matching (including scientific notation e.g. 1.2e+5)
    if (/\d|\./.test(char)) {
      let numStr = '';
      const start = i;
      let hasDot = false;

      while (i < normalized.length) {
        const c = normalized[i];
        if (c === '.') {
          if (hasDot) break;
          hasDot = true;
          numStr += c;
          i++;
        } else if (/\d/.test(c)) {
          numStr += c;
          i++;
        } else if (c === 'e' || c === 'E') {
          // Check if followed by optional sign and digit
          const nextChar = normalized[i + 1];
          const nextNextChar = normalized[i + 2];
          if (nextChar === '+' || nextChar === '-') {
            if (/\d/.test(nextNextChar)) {
              numStr += c + nextChar + nextNextChar;
              i += 3;
              while (i < normalized.length && /\d/.test(normalized[i])) {
                numStr += normalized[i];
                i++;
              }
            } else {
              break;
            }
          } else if (/\d/.test(nextChar)) {
            numStr += c + nextChar;
            i += 2;
            while (i < normalized.length && /\d/.test(normalized[i])) {
              numStr += normalized[i];
              i++;
            }
          } else {
            break;
          }
        } else {
          break;
        }
      }

      if (numStr === '.') {
        return { success: false, error: 'Invalid decimal point placement' };
      }

      tokens.push({ type: 'NUMBER', value: numStr, pos: start });
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: char, pos: i });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: char, pos: i });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '^', '%'].includes(char)) {
      tokens.push({ type: 'OP', value: char, pos: i });
      i++;
      continue;
    }

    return {
      success: false,
      error: `Unexpected character '${char}' at position ${i + 1}`,
    };
  }

  if (tokens.length === 0) {
    return { success: false, error: 'No valid expression tokens' };
  }

  // Recursive Descent Parser
  let current = 0;

  function peek(): Token | undefined {
    return tokens[current];
  }

  function consume(): Token {
    return tokens[current++];
  }

  function parseExpression(): number {
    return parseAdditive();
  }

  function parseAdditive(): number {
    let left = parseMultiplicative();

    while (peek() && peek()?.type === 'OP' && (peek()?.value === '+' || peek()?.value === '-')) {
      const op = consume().value;
      const right = parseMultiplicative();
      if (op === '+') left += right;
      else left -= right;
    }

    return left;
  }

  function parseMultiplicative(): number {
    let left = parsePower();

    while (
      peek() &&
      peek()?.type === 'OP' &&
      (peek()?.value === '*' || peek()?.value === '/' || peek()?.value === '%')
    ) {
      const op = consume().value;
      const right = parsePower();
      if (op === '*') {
        left *= right;
      } else if (op === '/') {
        if (right === 0) {
          throw new Error('Division by zero');
        }
        left /= right;
      } else if (op === '%') {
        if (right === 0) {
          throw new Error('Modulo by zero');
        }
        left %= right;
      }
    }

    return left;
  }

  function parsePower(): number {
    let left = parseUnary();

    if (peek() && peek()?.type === 'OP' && peek()?.value === '^') {
      consume(); // consume '^'
      const right = parsePower(); // right-associative
      left = Math.pow(left, right);
    }

    return left;
  }

  function parseUnary(): number {
    const token = peek();
    if (token && token.type === 'OP' && (token.value === '+' || token.value === '-')) {
      consume();
      const factor = token.value === '-' ? -1 : 1;
      const operand = parseUnary();
      return factor * operand;
    }

    return parsePrimary();
  }

  function parsePrimary(): number {
    const token = peek();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    if (token.type === 'NUMBER') {
      consume();
      const val = parseFloat(token.value);
      if (Number.isNaN(val)) {
        throw new Error(`Invalid number: ${token.value}`);
      }
      return val;
    }

    if (token.type === 'LPAREN') {
      consume(); // consume '('
      const result = parseExpression();
      const closing = peek();
      if (!closing || closing.type !== 'RPAREN') {
        throw new Error("Missing closing parenthesis ')'");
      }
      consume(); // consume ')'
      return result;
    }

    throw new Error(`Unexpected token '${token.value}'`);
  }

  try {
    const result = parseExpression();

    if (current < tokens.length) {
      return {
        success: false,
        error: `Unexpected token '${tokens[current].value}' at position ${tokens[current].pos + 1}`,
      };
    }

    if (!Number.isFinite(result)) {
      return { success: false, error: 'Calculation resulted in an infinite or non-numeric value' };
    }

    return {
      success: true,
      value: result,
      isExpression: tokens.length > 1 || tokens[0]?.type !== 'NUMBER',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid math expression';
    return { success: false, error: message };
  }
}
