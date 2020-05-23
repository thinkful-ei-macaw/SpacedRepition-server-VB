const LanguageService = require("../language/language-service");

// class _Node {
//   constructor(value = null, next = null) {
//     this.value = value;
//     this.next = next;
//   }
// }

// class LinkedList {
//   constructor() {
//     this.head = null;
//   }

//   insertFirst(item) {
//     this.head = new _Node(item, this.head);
//   }

//   displayList() {
//     let currNode = this.head;
//     while (currNode !== null) {
//       console.log(currNode.value);
//       currNode = currNode.next;
//     }
//   }

//   insertBefore(item, nextItem) {
//     if (this.head === null) {
//       this.insertFirst(item);
//     }
//     // tracking nextNode to insert item before nextNode
//     let currNode = this.head;
//     let prevNode = null;
//     // loop linked list, match nextNode to nextItem
//     while (currNode !== null && currNode.value !== nextItem) {
//       prevNode = currNode;
//       currNode = currNode.next;
//     }

//     if (prevNode === null) {
//       this.head = new _Node(item, this.head);
//     } else {
//       prevNode.next = new _Node(item, currNode);
//     }

//     // if prevItem not in list, error
//     if (currNode.next === null) {
//       throw new Error(`${nextItem} not found`);
//     }
//     // after finding nextNode, insert item before it
//   }

//   insertAfter(item, prevItem) {
//     if (this.head === null) {
//       this.insertFirst(item);
//     } else {
//       // track prevNode, insert item after prevNode
//       let currNode = this.head;
//       let prevNode = this.head;
//       // Loop through the list and find the node I want to insert the item after
//       while (currNode !== null && prevNode.value !== prevItem) {
//         prevNode = currNode;
//         currNode = currNode.next;
//       }
//       // If prevItem not in list, error
//       if (currNode === null && prevNode.value !== prevItem) {
//         console.log(`${prevItem} not found`);
//         return;
//       }
//       // After finding prevNode, insert item after
//       prevNode.next = new _Node(item, currNode);
//     }
//   }

//   insertLast(item) {
//     if (this.head === null) {
//       this.insertFirst(item);
//     } else {
//       let tempNode = this.head;
//       while (tempNode.next !== null) {
//         tempNode = tempNode.next;
//       }
//       tempNode.next = new _Node(item, null);
//     }
//   }
// insertAt(name,index){
//   let currNode = this.head;
//   let count = 0;
//   //check if index has num

//   while(currNode.next !== null){
//     if(count < index-1){ //at node before
//       currNode = currNode.next;
//       count++;
//     } else{
//       //connect new node to node after selected
//       const newNode = new Node(name, currNode.next.next);
//       //disconnect node to node after
//       currNode.next.next = null;
//       //connect new node to node before
//       currNode.next = newNode;
//       return newNode;
//     }
//   }

// }
// insertAt(pos, item) {
//   if (this.head === null) {
//     this.insertFirst(item);
//   }
//   let counter = 0;
//   let currNode = this.head;
//   let prevNode = this.head;
//   while (pos !== counter && currNode) {
//     prevNode = currNode;
//     currNode = currNode.next;

//     counter++;
//   }

//   prevNode.next = new _Node(item, currNode);
// }
//   insertAt(pos, item) {
//     let counter = 0;
//     let currNode = this.head;
//     let prevNode = null;
//     while (counter < pos) {
//       prevNode = currNode;
//       currNode = currNode.next;
//       counter++;
//     }
//     if (prevNode) {
//       prevNode.next = new _Node(item, currNode);
//     } else {
//       this.head = new _Node(item, currNode);
//     }
//   }
//   find(item) {
//     let currNode = this.head;
//     if (!this.head) {
//       return null;
//     }
//     while (currNode.value !== item) {
//       if (currNode.next !== null) {
//         return null;
//       } else {
//         currNode = currNode.next;
//       }
//     }
//     return currNode;
//   }
//   size() {
//     let currNode = this.head;
//     let count = 0;
//     while (currNode !== null) {
//       currNode = currNode.next;
//       count++;
//     }
//     return count;
//   }

//   remove(item) {
//     if (!this.head) {
//       return null;
//     }
//     if (this.head.value === item) {
//       this.head = this.head.next;
//       return;
//     }
//     let currNode = this.head;
//     let prevNode = this.head;
//     while (currNode !== null && currNode.value !== item) {
//       prevNode = currNode.next;
//       currNode = currNode.next;
//     }
//     if (currNode === null) {
//       return;
//     }
//     prevNode.next = currNode.next;
//   }
// }
class _Node {
  constructor(value, next) {
    (this.value = value), (this.next = next);
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
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
  /**Inserts a new node after a node containing the key.*/
  insertAfter(key, itemToInsert) {
    let tempNode = this.head;
    while (tempNode !== null && tempNode.value !== key) {
      tempNode = tempNode.next;
    }
    if (tempNode !== null) {
      tempNode.next = new _Node(itemToInsert, tempNode.next);
    }
  }
  /* Inserts a new node before a node containing the key.*/
  insertBefore(key, itemToInsert) {
    if (this.head == null) {
      return;
    }
    if (this.head.value == key) {
      this.insertFirst(itemToInsert);
      return;
    }
    let prevNode = null;
    let currNode = this.head;
    while (currNode !== null && currNode.value !== key) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Node not found to insert");
      return;
    }
    //insert between current and previous
    prevNode.next = new _Node(itemToInsert, currNode);
  }
  insertAt(nthPosition, itemToInsert) {
    if (nthPosition < 0) {
      throw new Error("Position error");
    }
    if (nthPosition === 0) {
      this.insertFirst(itemToInsert);
    } else {
      // Find the node which we want to insert after
      const node = this._findNthElement(nthPosition - 1);
      const newNode = new _Node(itemToInsert, null);
      newNode.next = node.next;
      node.next = newNode;
    }
  }
  _findNthElement(position) {
    let node = this.head;
    for (let i = 0; i < position; i++) {
      node = node.next;
    }
    return node;
  }
  remove(item) {
    //if the list is empty
    if (!this.head) {
      return null;
    }
    //if the node to be removed is head, make the next node head
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    //start at the head
    let currNode = this.head;
    //keep track of previous
    let previousNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      //save the previous node
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    previousNode.next = currNode.next;
  }
  find(item) {
    //get
    //start at the head
    let currNode = this.head;
    //if the list is empty
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      //return null if end of the list
      // and the item is not on the list
      if (currNode.next === null) {
        return null;
      } else {
        //keep looking
        currNode = currNode.next;
      }
    }
    //found it
    return currNode;
  }
  displayList() {
    let list = "";
    let currNode = this.head;
    while (currNode !== null) {
      list += `${JSON.stringify(currNode.value.id)} => `;
      currNode = currNode.next;
    }
    console.log(list);
  }
}

module.exports = LinkedList;
