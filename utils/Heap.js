"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeapType = void 0;
var HeapType;
(function (HeapType) {
    HeapType[HeapType["Min"] = 0] = "Min";
    HeapType[HeapType["Max"] = 1] = "Max";
})(HeapType || (exports.HeapType = HeapType = {}));
var Heap = /** @class */ (function () {
    function Heap(type, nums) {
        var _this = this;
        this.type = type;
        this.heap = [];
        if (nums) {
            nums.forEach(function (n) { return _this.add(n); });
        }
    }
    Heap.prototype.peek = function () {
        return this.heap.length > 0 ? this.heap[0] : null;
    };
    Heap.prototype.add = function (value) {
        this.heap.push(value);
        this.heapifyUp();
    };
    Heap.prototype.remove = function () {
        if (this.heap.length === 0) {
            return null;
        }
        var minValue = this.heap[0];
        if (this.heap.length > 1) {
            this.heap[0] = this.heap.pop();
            this.heapifyDown();
        }
        else {
            this.heap = [];
        }
        return minValue;
    };
    Heap.prototype.getLeftChildIndex = function (parentIndex) {
        return 2 * parentIndex + 1;
    };
    Heap.prototype.getRightChildIndex = function (parentIndex) {
        return 2 * parentIndex + 2;
    };
    Heap.prototype.getParentIndex = function (childIndex) {
        return Math.floor((childIndex - 1) / 2);
    };
    Heap.prototype.hasParent = function (index) {
        return this.getParentIndex(index) >= 0;
    };
    Heap.prototype.swap = function (index1, index2) {
        var _a;
        _a = [this.heap[index2], this.heap[index1]], this.heap[index1] = _a[0], this.heap[index2] = _a[1];
    };
    Heap.prototype.shouldSwapUp = function (idx) {
        return ((this.type === HeapType.Min && this.heap[idx] < this.heap[this.getParentIndex(idx)]) ||
            (this.type === HeapType.Max && this.heap[idx] > this.heap[this.getParentIndex(idx)]));
    };
    Heap.prototype.shouldSwapDown = function (currentIdx, childIdx) {
        return ((this.type === HeapType.Min && this.heap[currentIdx] < this.heap[childIdx]) ||
            (this.type === HeapType.Max && this.heap[currentIdx] > this.heap[childIdx]));
    };
    Heap.prototype.getSwappableChildIndex = function (idx) {
        var swappableChildIndex = this.getLeftChildIndex(idx);
        if ((this.getRightChildIndex(idx) < this.heap.length &&
            this.type === HeapType.Min &&
            this.heap[this.getRightChildIndex(idx)] < this.heap[swappableChildIndex]) ||
            (this.type === HeapType.Max && this.heap[this.getRightChildIndex(idx)] > this.heap[swappableChildIndex])) {
            swappableChildIndex = this.getRightChildIndex(idx);
        }
        return swappableChildIndex;
    };
    Heap.prototype.heapifyUp = function () {
        var currentIndex = this.heap.length - 1;
        while (this.hasParent(currentIndex) && this.shouldSwapUp(currentIndex)) {
            this.swap(currentIndex, this.getParentIndex(currentIndex));
            currentIndex = this.getParentIndex(currentIndex);
        }
    };
    Heap.prototype.heapifyDown = function () {
        var currentIndex = 0;
        while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
            var swappableChildIndex = this.getSwappableChildIndex(currentIndex);
            if (this.shouldSwapDown(currentIndex, swappableChildIndex)) {
                break;
            }
            else {
                this.swap(currentIndex, swappableChildIndex);
            }
            currentIndex = swappableChildIndex;
        }
    };
    return Heap;
}());
exports.default = Heap;
