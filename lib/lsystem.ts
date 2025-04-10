// src/lib/lsystem.ts
import { OperationType, VariableType, Operation, SystemRules } from './types';

/**
 * Mapping from character encoding to operation or variable type
 * This is only used to maintain compatibility with the original format
 */
export const CHAR_TO_TYPE: Record<string, OperationType | VariableType | { type: OperationType; value: number }> = {
  '+': OperationType.ROTATE_RIGHT,
  '-': OperationType.ROTATE_LEFT,
  '*': OperationType.ROTATE_RIGHT_DOUBLE,
  '/': OperationType.ROTATE_RIGHT_HALF,
  '^': OperationType.ROTATE_SQUARED,
  '$': OperationType.ROTATE_CUBED,
  'F': OperationType.DRAW_FORWARD,
  '[': OperationType.PUSH_STATE,
  ']': OperationType.POP_STATE,
  'W': VariableType.RULE_W,
  'X': VariableType.RULE_X,
  'Y': VariableType.RULE_Y,
  'Z': VariableType.RULE_Z,
  '0': { type: OperationType.REPEAT, value: 0 },
  '1': { type: OperationType.REPEAT, value: 1 },
  '2': { type: OperationType.REPEAT, value: 2 },
  '3': { type: OperationType.REPEAT, value: 3 },
  '4': { type: OperationType.REPEAT, value: 4 },
  '5': { type: OperationType.REPEAT, value: 5 },
  '6': { type: OperationType.REPEAT, value: 6 },
  '7': { type: OperationType.REPEAT, value: 7 },
  '8': { type: OperationType.REPEAT, value: 8 },
  '9': { type: OperationType.REPEAT, value: 9 }
};

/**
 * Reverse mapping from operation/variable type to character encoding
 */
export const TYPE_TO_CHAR: Record<string, string | Record<number, string>> = {};

// Build the reverse mapping
Object.entries(CHAR_TO_TYPE).forEach(([char, type]) => {
  if (typeof type === 'object' && 'type' in type && type.type === OperationType.REPEAT) {
    if (!TYPE_TO_CHAR[OperationType.REPEAT]) {
      TYPE_TO_CHAR[OperationType.REPEAT] = {};
    }
    (TYPE_TO_CHAR[OperationType.REPEAT] as Record<number, string>)[type.value] = char;
  } else {
    TYPE_TO_CHAR[type as string] = char;
  }
});

/**
 * Converts a character-based string to an array of typed operations
 * @param {string} str - Character string to convert
 * @returns {Operation[]} Array of typed operations
 */
export const stringToOperations = (str: string): Operation[] => {
  const operations: Operation[] = [];
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const typeOrObj = CHAR_TO_TYPE[char];
    
    if (typeOrObj) {
      if (typeof typeOrObj === 'object' && 'type' in typeOrObj) {
        // For repeat operations with values
        operations.push({ 
          type: typeOrObj.type, 
          value: typeOrObj.value 
        });
      } else {
        // For standard operations
        operations.push({ type: typeOrObj as OperationType | VariableType });
      }
    } else {
      console.warn(`Unknown character in L-system: ${char}`);
    }
  }
  
  return operations;
};

/**
 * Converts an array of typed operations back to a character string
 * @param {Operation[]} operations - Array of typed operations
 * @returns {string} Character string representation
 */
export const operationsToString = (operations: Operation[]): string => {
  return operations.map(op => {
    if (op.type === OperationType.REPEAT && op.value !== undefined) {
      return (TYPE_TO_CHAR[OperationType.REPEAT] as Record<number, string>)[op.value];
    }
    return TYPE_TO_CHAR[op.type] as string;
  }).join('');
};

/**
 * Gets a random character from the provided string
 * @param {string} chars - String of possible characters
 * @returns {string} Random character
 */
const getRandomChar = (chars: string): string => {
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

/**
 * Generates a random string of specified length
 * @param {number} length - Length of the string to generate
 * @param {string} chars - Characters to use in generation
 * @returns {string} - Random string
 */
const generateRandomString = (length: number, chars: string): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(chars);
  }
  return result;
};

/**
 * Generates L-system rules - Modified to match Java version's RandomString generator
 * @param {number} axiomAmount - Number of axioms to generate
 * @returns {SystemRules} - Set of L-system rules
 */
export const generateRules = (axiomAmount: number): SystemRules => {
  // Matching Java version's character set
  const structure = "+-*/^$0123456789WXYZF";
  
  // Create base axiom pattern
  let axiomStr = '';
  for (let i = 0; i < axiomAmount; i++) {
    axiomStr += '[X]++';
  }
  
  // Generate rule strings similar to Java RandomString class
  const genTwo = generateRandomString(2, structure);
  const genThree = generateRandomString(3, structure);
  const genFour = generateRandomString(4, structure);
  
  // Mimic Java version rule patterns
  const ruleWStr = `${genTwo}++${genThree}${genTwo}[${genThree}${genTwo}]++`;
  const ruleXStr = `+YF${genFour}[${genTwo}${genTwo}${genFour}]+`;
  const ruleYStr = `-WF${genFour}[${genFour}${genFour}]-`;
  const ruleZStr = `--YF+^+WF[+ZF++++XF]--XF`;
  
  // Convert to operations
  return {
    axiom: stringToOperations(axiomStr),
    ruleW: stringToOperations(ruleWStr),
    ruleX: stringToOperations(ruleXStr),
    ruleY: stringToOperations(ruleYStr),
    ruleZ: stringToOperations(ruleZStr)
  };
};

/**
 * Simulate L-system for multiple generations - Matching Java version structure
 * @param {number} generations - Number of generations to simulate
 * @param {Operation[]} startProduction - Starting production operations
 * @param {SystemRules} rules - L-system rules
 * @returns {Operation[]} - Final production operations
 */
export const simulateLSystem = (generations: number, startProduction: Operation[], rules: SystemRules): Operation[] => {
  let current: Operation[] = [...startProduction];
  
  // Map of variables to their replacement rules
  const ruleMap: Record<VariableType, Operation[]> = {
    [VariableType.RULE_W]: rules.ruleW,
    [VariableType.RULE_X]: rules.ruleX,
    [VariableType.RULE_Y]: rules.ruleY,
    [VariableType.RULE_Z]: rules.ruleZ
  };
  
  // Apply rules for the specified number of generations - matching Java iterate method
  for (let gen = 0; gen < generations; gen++) {
    let next: Operation[] = [];
    
    // Process each operation in the current production
    for (const operation of current) {
      // Apply rule if operation is a variable with a rule
      if (operation.type in ruleMap) {
        next.push(...ruleMap[operation.type as VariableType]);
      } 
      // Keep other operations as is
      else {
        next.push(operation);
      }
    }
    
    current = next;
  }
  
  return current;
};

/**
 * For backward compatibility: generate rules using character-based format
 * @param {number} axiomAmount - Number of axioms to generate
 * @returns {Record<string, string>} - Set of L-system rules using string format
 */
export const generateRulesAsStrings = (axiomAmount: number): Record<string, string> => {
  const rules = generateRules(axiomAmount);
  
  return {
    axiom: operationsToString(rules.axiom),
    ruleW: operationsToString(rules.ruleW),
    ruleX: operationsToString(rules.ruleX),
    ruleY: operationsToString(rules.ruleY),
    ruleZ: operationsToString(rules.ruleZ)
  };
};