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
 * Generates a random operation sequence
 * @param {number} length - Length of sequence to generate
 * @returns {Operation[]} - Array of operations
 */
export const generateRandomOperations = (length: number): Operation[] => {
  // All possible operations for random generation
  const possibleOperations: Operation[] = [
    { type: OperationType.ROTATE_RIGHT },
    { type: OperationType.ROTATE_LEFT },
    { type: OperationType.ROTATE_RIGHT_DOUBLE },
    { type: OperationType.ROTATE_RIGHT_HALF },
    { type: OperationType.ROTATE_SQUARED },
    { type: OperationType.ROTATE_CUBED },
    { type: OperationType.DRAW_FORWARD },
    { type: OperationType.PUSH_STATE },
    { type: OperationType.POP_STATE },
    { type: VariableType.RULE_W },
    { type: VariableType.RULE_X },
    { type: VariableType.RULE_Y },
    { type: VariableType.RULE_Z }
  ];
  
  // Add repeat operations
  for (let i = 0; i <= 9; i++) {
    possibleOperations.push({ type: OperationType.REPEAT, value: i });
  }
  
  // Generate random operations
  const operations: Operation[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * possibleOperations.length);
    operations.push({ ...possibleOperations[randomIndex] });
  }
  
  return operations;
};

/**
 * Generates L-system rules
 * @param {number} axiomAmount - Number of axioms to generate
 * @returns {SystemRules} - Set of L-system rules
 */
export const generateRules = (axiomAmount: number): SystemRules => {
  // Create base axiom pattern
  const axiomPattern: Operation[] = [
    { type: OperationType.PUSH_STATE },
    { type: VariableType.RULE_X },
    { type: OperationType.POP_STATE },
    { type: OperationType.ROTATE_RIGHT },
    { type: OperationType.ROTATE_RIGHT }
  ];
  
  // Repeat axiom pattern for specified amount
  const axiom: Operation[] = Array(axiomAmount).fill(0).flatMap(() => [...axiomPattern]);
  
  // Generate rule patterns
  return {
    axiom,
    ruleW: [
      ...generateRandomOperations(2),
      { type: OperationType.ROTATE_RIGHT },
      { type: OperationType.ROTATE_RIGHT },
      ...generateRandomOperations(3),
      ...generateRandomOperations(2),
      { type: OperationType.PUSH_STATE },
      ...generateRandomOperations(3),
      ...generateRandomOperations(2),
      { type: OperationType.POP_STATE },
      { type: OperationType.ROTATE_RIGHT },
      { type: OperationType.ROTATE_RIGHT }
    ],
    ruleX: [
      { type: OperationType.ROTATE_RIGHT },
      { type: VariableType.RULE_Y },
      { type: OperationType.DRAW_FORWARD },
      ...generateRandomOperations(4),
      { type: OperationType.PUSH_STATE },
      ...generateRandomOperations(2),
      ...generateRandomOperations(2),
      ...generateRandomOperations(4),
      { type: OperationType.POP_STATE },
      { type: OperationType.ROTATE_RIGHT }
    ],
    ruleY: [
      { type: OperationType.ROTATE_LEFT },
      { type: VariableType.RULE_W },
      { type: OperationType.DRAW_FORWARD },
      ...generateRandomOperations(4),
      { type: OperationType.PUSH_STATE },
      ...generateRandomOperations(4),
      ...generateRandomOperations(4),
      { type: OperationType.POP_STATE },
      { type: OperationType.ROTATE_LEFT }
    ],
    ruleZ: [
      { type: OperationType.ROTATE_LEFT },
      { type: OperationType.ROTATE_LEFT },
      { type: VariableType.RULE_Y },
      { type: OperationType.DRAW_FORWARD },
      { type: OperationType.ROTATE_RIGHT },
      { type: OperationType.ROTATE_SQUARED },
      { type: OperationType.ROTATE_RIGHT },
      { type: VariableType.RULE_W },
      { type: OperationType.DRAW_FORWARD },
      { type: OperationType.PUSH_STATE },
      { type: OperationType.ROTATE_RIGHT },
      { type: VariableType.RULE_Z },
      { type: OperationType.DRAW_FORWARD },
      { type: OperationType.ROTATE_RIGHT },
      { type: OperationType.ROTATE_RIGHT },
      { type: OperationType.ROTATE_RIGHT },
      { type: OperationType.ROTATE_RIGHT },
      { type: VariableType.RULE_X },
      { type: OperationType.DRAW_FORWARD },
      { type: OperationType.POP_STATE },
      { type: OperationType.ROTATE_LEFT },
      { type: OperationType.ROTATE_LEFT },
      { type: VariableType.RULE_X },
      { type: OperationType.DRAW_FORWARD }
    ]
  };
};

/**
 * Simulate L-system for multiple generations
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
  
  // Apply rules for the specified number of generations
  for (let gen = 0; gen < generations; gen++) {
    let next: Operation[] = [];
    
    // Process each operation in the current production
    for (const operation of current) {
      // Apply rule if operation is a variable with a rule
      if (operation.type in ruleMap) {
        next.push(...ruleMap[operation.type as VariableType]);
      } 
      // Skip 'DRAW_FORWARD' operations in intermediary productions to avoid excessive growth
      else if (operation.type !== OperationType.DRAW_FORWARD || gen === generations - 1) {
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

/**
 * For backward compatibility: simulate L-system using character-based format
 * @param {number} generations - Number of generations to simulate
 * @param {string} startProductionStr - Starting production string
 * @param {Record<string, string>} rulesStr - L-system rules as strings
 * @returns {string} - Final production string
 */
export const simulateLSystemFromStrings = (
  generations: number, 
  startProductionStr: string, 
  rulesStr: Record<string, string>
): string => {
  const startProduction = stringToOperations(startProductionStr);
  const rules = {
    axiom: stringToOperations(rulesStr.axiom),
    ruleW: stringToOperations(rulesStr.ruleW),
    ruleX: stringToOperations(rulesStr.ruleX),
    ruleY: stringToOperations(rulesStr.ruleY),
    ruleZ: stringToOperations(rulesStr.ruleZ)
  };
  
  const result = simulateLSystem(generations, startProduction, rules);
  return operationsToString(result);
};