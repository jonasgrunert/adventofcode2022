import Solution from "./solution.ts";

class Node {
  #value: number;
  #next?: Node;
  #prev?: Node;

  constructor(n: number) {
    this.#value = n;
  }

  next(n = 0) {
    let node: Node = this.#next!;
    for (let i = 0; i < n - 1; i++) {
      node = node.#next!;
    }
    return node;
  }

  prev(n = 0) {
    let node: Node = this.#prev!;
    for (let i = 0; i < n; i++) {
      node = node.#prev!;
    }
    return node;
  }

  put(prev: Node) {
    this.#prev = prev;
    this.#next = prev.#next;
    prev.#next = this;
    if (this.#next) {
      this.#next.#prev = this;
    }
  }

  take() {
    if (this.#prev) this.#prev.#next = this.#next;
    if (this.#next) this.#next.#prev = this.#prev;
  }

  set(prev: Node, next: Node) {
    this.#prev = prev;
    this.#next = next;
  }

  move(length: number, mod = 1) {
    this.take();
    const t =
      this.#value < 0
        ? this.prev(Math.abs(this.#value * mod) % (length - 1))
        : this.next((this.#value * mod) % (length - 1));
    this.put(t);
  }

  get value() {
    return this.#value;
  }

  print(mod = 1) {
    let node = this.#next!;
    while (node !== this) {
      console.log(node.#value * mod);
      node = node.#next!;
    }
  }
}

const task = new Solution(
  (arr: Node[]) => {
    let zero: Node | undefined;
    arr.forEach((node, i, all) => {
      node.set(all.at(i - 1)!, all.at(i + 1) ?? all.at(0)!);
      if (node.value === 0) zero = node;
    });
    for (const node of arr) {
      if (node === zero) continue;
      node.move(arr.length);
    }
    let sum = 0;
    let node = zero;
    for (let i = 0; i < 3; i++) {
      node = node!.next(1000);
      sum += node.value;
    }
    return sum;
  },
  (arr: Node[]) => {
    let zero: Node | undefined;
    arr.forEach((node, i, all) => {
      node.set(all.at(i - 1)!, all.at(i + 1) ?? all.at(0)!);
      if (node.value === 0) zero = node;
    });
    for (let i = 0; i < 10; i++) {
      for (const node of arr) {
        if (node === zero) continue;
        node.move(arr.length, 811589153);
      }
    }
    let sum = 0;
    let node = zero;
    for (let i = 0; i < 3; i++) {
      node = node!.next(1000);
      sum += node.value;
    }
    return sum * 811589153;
  },
  {
    transform: (n) => new Node(Number.parseInt(n)),
    sep: "\n",
  },
);
task.expect(3, 1623178306);

if (import.meta.main) await task.execute();

export default task;
