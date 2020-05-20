const LinkedList = require("../linked-list/linked-list");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },
  createWordList(nextWerd) {
    const sll = new LinkedList();
    // //if any items in ll

    // let currentNode = sll.head;
    // let previousNode = sll.head;
    // let someArray = []
    // while(currentNode.next !== null){
    //   previousNode
    // }

    for (let i = nextWerd.length - 1; i >= 0; i--) {
      sll.insertFirst(nextWerd[i]);
    }
    return sll;
  },
};

module.exports = LanguageService;
