const LanguageService = require("../language/language-service");

class _Node {
  constructor(value = null, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertBefore(item, nextItem) {
    if (this.head === null) {
      this.insertFirst(item);
    }
    // tracking nextNode to insert item before nextNode
    let currNode = this.head;
    let prevNode = null;
    // loop linked list, match nextNode to nextItem
    while (currNode !== null && currNode.value !== nextItem) {
      prevNode = currNode;
      currNode = currNode.next;
    }

    if (prevNode === null) {
      this.head = new _Node(item, this.head);
    } else {
      prevNode.next = new _Node(item, currNode);
    }

    // if prevItem not in list, error
    if (currNode.next === null) {
      throw new Error(`${nextItem} not found`);
    }
    // after finding nextNode, insert item before it
  }

  insertAfter(item, prevItem) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      // track prevNode, insert item after prevNode
      let currNode = this.head;
      let prevNode = this.head;
      // Loop through the list and find the node I want to insert the item after
      while (currNode !== null && prevNode.value !== prevItem) {
        prevNode = currNode;
        currNode = currNode.next;
      }
      // If prevItem not in list, error
      if (currNode === null && prevNode.value !== prevItem) {
        console.log(`${prevItem} not found`);
        return;
      }
      // After finding prevNode, insert item after
      prevNode.next = new _Node(item, currNode);
    }
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertAt(pos, item) {
    if (this.head === null) {
      this.insertFirst(pos);
    }
    let counter = 0;
    let currNode = this.head;
    let prevNode = this.head;
    while (pos - 1 !== counter) {
      prevNode = currNode;
      currNode = currNode.next;
      counter++;
      if (currNode.next === null) {
        console.log("cannot insert");
        return null;
      }
    }
    if (typeof pos === "number") {
      prevNode.next = new _Node(item, currNode.next);
    } else {
      prevNode.next = new _Node(item, currNode.next);
    }
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next !== null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let prevNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      prevNode = currNode.next;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("item not found");
      return;
    }
    prevNode.next = currNode.next;
  }
}
// const SLL = new LinkedList();

// function makeWordList() {
//     LanguageService.getLanguageWords()
//   SLL.insertFirst;
// }
module.exports = LinkedList;
