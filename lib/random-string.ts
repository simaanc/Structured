// src/lib/random-string.ts
/**
 * A direct port of the RandomString class from Java to TypeScript
 */
export class RandomString {
    public static readonly structure = "+-*/^$0123456789WXYZF";
    private random: () => number;
    private symbols: string[];
    private buf: string[];
    private length: number;
  
    constructor(length: number, randomFn: () => number, symbols: string) {
      if (length < 1) throw new Error("Length must be at least 1");
      if (symbols.length < 2) throw new Error("Symbols must have at least 2 characters");
      
      this.length = length;
      this.random = randomFn;
      this.symbols = symbols.split('');
      this.buf = new Array(length);
    }
  
    /**
     * Generate a random string.
     */
    public nextString(): string {
      for (let idx = 0; idx < this.length; ++idx) {
        this.buf[idx] = this.symbols[Math.floor(this.random() * this.symbols.length)];
      }
      return this.buf.join('');
    }
  
    /**
     * Create an instance with the default structure.
     */
    public static create(length: number): RandomString {
      return new RandomString(length, Math.random, RandomString.structure);
    }
  }
  
  /**
   * Generates L-system rules exactly matching the Java version
   */
  export function generateRules(axiomAmount: number): {
    axiom: string,
    ruleW: string,
    ruleX: string,
    ruleY: string,
    ruleZ: string
  } {
    // Create axiom string exactly as in Java
    const axiom = "[X]++".repeat(axiomAmount);
    
    // Create random generators matching Java's RandomString class
    const gen = RandomString.structure;
    const genfour = RandomString.create(4);
    const genthree = RandomString.create(3);
    const gentwo = RandomString.create(2);
    
    // Generate rules exactly as in the Java code
    const ruleW = `${gentwo.nextString()}++${genthree.nextString()}${gentwo.nextString()}[${genthree.nextString()}${gentwo.nextString()}]++`;
    const ruleX = `+YF${genfour.nextString()}[${gentwo.nextString()}${gentwo.nextString()}${genfour.nextString()}]+`;
    const ruleY = `-WF${genfour.nextString()}[${genfour.nextString()}${genfour.nextString()}]-`;
    const ruleZ = "--YF+^+WF[+ZF++++XF]--XF";
    
    return { axiom, ruleW, ruleX, ruleY, ruleZ };
  }