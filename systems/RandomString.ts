export default class RandomString {
  static structure = "+-*/^$0123456789WXYZF";
  constructor(
    private length: number,
    private symbols: string = RandomString.structure,
  ) {
    if (length < 1 || symbols.length < 2) throw new Error();
  }
  nextString(): string {
    let s = "";
    for (let i = 0; i < this.length; i++) {
      s += this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }
    return s;
  }
}
