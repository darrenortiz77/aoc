export enum HeapType {
  Min,
  Max,
}

export default class Heap {
  private heap: number[] = [];

  constructor(private type: HeapType, nums?: number[]) {
    if (nums) {
      nums.forEach((n) => this.add(n));
    }
  }

  public peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public add(value: number) {
    this.heap.push(value);
    this.heapifyUp();
  }

  public remove() {
    if (this.heap.length === 0) {
      return null;
    }

    const minValue = this.heap[0];

    if (this.heap.length > 1) {
      this.heap[0] = this.heap.pop()!;
      this.heapifyDown();
    } else {
      this.heap = [];
    }

    return minValue;
  }

  private getLeftChildIndex(parentIndex: number) {
    return 2 * parentIndex + 1;
  }

  private getRightChildIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }

  private getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  private hasParent(index: number) {
    return this.getParentIndex(index) >= 0;
  }

  private swap(index1: number, index2: number) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  private shouldSwapUp(idx: number) {
    return (
      (this.type === HeapType.Min && this.heap[idx] < this.heap[this.getParentIndex(idx)]) ||
      (this.type === HeapType.Max && this.heap[idx] > this.heap[this.getParentIndex(idx)])
    );
  }

  private shouldSwapDown(currentIdx: number, childIdx: number) {
    return (
      (this.type === HeapType.Min && this.heap[currentIdx] < this.heap[childIdx]) ||
      (this.type === HeapType.Max && this.heap[currentIdx] > this.heap[childIdx])
    );
  }

  private getSwappableChildIndex(idx: number) {
    let swappableChildIndex = this.getLeftChildIndex(idx);
    if (
      (this.getRightChildIndex(idx) < this.heap.length &&
        this.type === HeapType.Min &&
        this.heap[this.getRightChildIndex(idx)] < this.heap[swappableChildIndex]) ||
      (this.type === HeapType.Max && this.heap[this.getRightChildIndex(idx)] > this.heap[swappableChildIndex])
    ) {
      swappableChildIndex = this.getRightChildIndex(idx);
    }

    return swappableChildIndex;
  }

  private heapifyUp() {
    let currentIndex = this.heap.length - 1;
    while (this.hasParent(currentIndex) && this.shouldSwapUp(currentIndex)) {
      this.swap(currentIndex, this.getParentIndex(currentIndex));
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  private heapifyDown() {
    let currentIndex = 0;
    while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
      const swappableChildIndex = this.getSwappableChildIndex(currentIndex);

      if (this.shouldSwapDown(currentIndex, swappableChildIndex)) {
        break;
      } else {
        this.swap(currentIndex, swappableChildIndex);
      }

      currentIndex = swappableChildIndex;
    }
  }
}
