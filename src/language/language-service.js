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
        "word.id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count",
        "language.head"
      )
      .join("language", "language.id", "=", "word.language_id")
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
    let head = nextWerd.find((word) => word.id === word.head);
    console.log("weee", head);
    sll.insertFirst(head);
    let next = nextWerd.find((word) => word.id === head.next);
    while (next) {
      sll.insertLast(next);
      next = nextWerd.find((word) => word.id === next.next);
    }
    return sll;
  },
  serialize: async function (db, sll) {
    let trx = await db.transaction();
    try {
      let curr = sll.head;

      while (curr && curr.next) {
        let newNode = {
          next: curr.next.value.id,
          incorrect_count: curr.value.incorrect_count,
          correct_count: curr.value.correct_count,
          memory_value: curr.value.memory_value,
        };
        console.log(newNode);
        console.log(curr.value);
        await db("word")
          .transacting(trx)
          .update(newNode)
          .where({ id: curr.value.id });
        curr = curr.next;
      }
      let lang = { head: sll.head.value.id };
      await db("language")
        .transacting(trx)
        .update(lang)
        .where({ id: sll.head.value.language_id });
      await trx.commit();
    } catch (e) {
      console.log(e);
      await trx.rollback();
    }
  },
};

module.exports = LanguageService;
