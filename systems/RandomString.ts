// systems/RandomString.ts
export default class RandomString {
  static structure = "+-*/^$0123456789WXYZF";
  private random: () => number;
  
  constructor(
    private length: number,
    private symbols: string = RandomString.structure,
    // Allow passing in a custom random function
    randomFunc?: () => number
  ) {
    if (length < 1 || symbols.length < 2) throw new Error();
    this.random = randomFunc || Math.random;
  }
  
  nextString(): string {
    let s = "";
    for (let i = 0; i < this.length; i++) {
      s += this.symbols[Math.floor(this.random() * this.symbols.length)];
    }
    return s;
  }
}