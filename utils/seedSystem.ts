// utils/seedSystem.ts
import seedrandom from 'seedrandom';
import { Params } from '../types/types';

interface SeedData {
  params: Params;
  randomSeed: string; // String to seed the RNG
}

/**
 * Encodes the current state of the app into a shareable text seed
 * that can be used to recreate the exact same image
 */
export function encodeToSeed(params: Params, existingRandomSeed?: string): string {
    // Use the existing random seed if provided, otherwise create a new one
    const randomSeed = existingRandomSeed || Math.random().toString(36).substring(2, 15);
    
    const seedData: SeedData = {
      params,
      randomSeed
    };
    
    // Convert the seed data to a compact JSON string
    const jsonString = JSON.stringify(seedData);
    
    // Base64 encode the string for sharing (makes it URL-friendly)
    return btoa(jsonString);
  }

/**
 * Decodes a seed string back into seed data
 */
export function decodeFromSeed(seed: string): SeedData | null {
  try {
    // Decode the Base64 string
    const jsonString = atob(seed);
    
    // Parse back into an object
    const seedData = JSON.parse(jsonString) as SeedData;
    
    // Validate that this is actually a valid SeedData object
    validateSeedData(seedData);
    
    return seedData;
  } catch (error) {
    console.error("Failed to decode seed:", error);
    return null;
  }
}

/**
 * Gets a seeded random number generator from the seed data
 */
export function getSeededRandom(randomSeed: string): () => number {
  return seedrandom(randomSeed);
}

/**
 * Validates that the decoded object has all required properties
 */
function validateSeedData(data: any): asserts data is SeedData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid seed: not an object');
  }
  
  if (!data.params || typeof data.params !== 'object') {
    throw new Error('Invalid seed: missing params');
  }
  
  if (!data.randomSeed || typeof data.randomSeed !== 'string') {
    throw new Error('Invalid seed: missing randomSeed');
  }
  
  // Validate params structure
  validateParams(data.params);
}

/**
 * Validates that the decoded object has all required Params properties
 */
function validateParams(params: any): asserts params is Params {
  const requiredNumericProps: Array<keyof Params> = [
    'gens', 'complexity', 'opacity', 'alpha', 'strokeWeight',
    'axiomAmount', 'lerpFrequency', 'scatter', 'startHue',
    'startSat', 'startBri', 'minSizeMultiplier', 'maxSizeMultiplier',
    'widthRatio', 'heightRatio', 'thetaDeg', 'startLength'
  ];
  
  // Check that all required numeric properties exist and are numbers
  for (const prop of requiredNumericProps) {
    if (typeof params[prop] !== 'number') {
      throw new Error(`Invalid seed: missing or invalid property ${prop}`);
    }
  }
  
  // Check that toggle flags exist and have correct shape
  if (!params.toggleFlags || typeof params.toggleFlags !== 'object') {
    throw new Error('Invalid seed: missing or invalid toggleFlags');
  }
  
  // Check specific toggle flags exist
  const requiredFlags = [
    'line', 'square', 'circle', 'triangle', 'hex', 'cube',
    'squareFill', 'circleFill', 'triangleFill', 'hexFill', 'cubeFill'
  ];
  
  for (const flag of requiredFlags) {
    if (typeof params.toggleFlags[flag] !== 'boolean') {
      throw new Error(`Invalid seed: missing or invalid toggle flag ${flag}`);
    }
  }
}