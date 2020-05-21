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
    // nextWerd = all the words from the "word" table,
    // for the given language
    const sll = new LinkedList();

    // find the head of the list, and insert into LL
    // select * from word where id={word.head}
    let head = nextWerd.find((word) => word.id === word.head);
    console.log("weee", head);
    sll.insertFirst(head);
    //find word that is equal to the head's next value
    // select * from word where id={head.next}
    let next = nextWerd.find((word) => word.id === head.next);

    while (next) {
      sll.insertLast(next);
      //find next word that matches the id from next column

      // select * from word where id={next.next}
      //if next.next is null find will return null to exit loop
      next = nextWerd.find((word) => word.id === next.next);
    }
    return sll;
  },

  // Given a linked list, commit all the updates back to
  // the database
  serialize: async function (db, sll, userlang) {
    // BEGIN;
    let trx = await db.transaction();
    try {
      let curr = sll.head;

      while (curr && curr.next) {
        // iterate thru linked list
        let newNode = {
          next: curr.next.value.id,
          incorrect_count: curr.value.incorrect_count,
          correct_count: curr.value.correct_count,
          memory_value: curr.value.memory_value,
        };

        // UPDATE word set next=?,incorrect_count=? where id={curr.value.id};
        await db("word")
          .transacting(trx)
          .update(newNode)
          .where({ id: curr.value.id });
        curr = curr.next;
      }
      let lang = { head: sll.head.value.id, total_score: userlang.total_score };
      // update language set head=?,total_score=? where id={sll.head.value.language_id}
      await db("language").transacting(trx).update(lang).where({
        id: sll.head.value.language_id,
      });
      // Successful, let's commit everything
      await trx.commit(); // COMMIT;
    } catch (e) {
      // Something failed, undo all changes
      console.log(e);
      await trx.rollback(); // ROLLBACK;
    }
  },
};

module.exports = LanguageService;
