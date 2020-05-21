const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json();

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", requireAuth, async (req, res, next) => {
  try {
    const nextWord = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      nextWord: nextWord[0].original,
      totalScore: req.language.total_score,
      wordCorrectCount: nextWord[0].correct_count,
      wordIncorrectCount: nextWord[0].incorrect_count,
    });
  } catch (error) {
    next(error);
  }
});

languageRouter.post(
  "/guess",
  jsonBodyParser,
  requireAuth,
  async (req, res, next) => {
    if (!req.body.guess) {
      return res.status(400).send({ error: "Missing 'guess' in request body" });
    }
    try {
      //get all words from database
      const allWords = await LanguageService.getLanguageWords(
        req.app.get("db"),
        req.language.id
      );
      //get language of user
      const userLang = await LanguageService.getUsersLanguage(
        req.app.get("db"),
        req.language.user_id
      );
      //convert all words into a linked list
      const wordsList = LanguageService.createWordList(
        allWords,
        req.language.head
      );
      let answer;
      let currentNode = wordsList.head;
      // TODO: PRINT OUT the linked list
      //if guess is not correct
      wordsList.displayList();
      if (req.body.guess !== wordsList.head.value.translation) {
        /*
        * = word we're on
                  *
        A -> B -> C -> D
            to
        A -> C -> B -> D
        memory value the ones you guess incorrect is what you will see more often
        will organize lowest memory value to highest memory value 
        */
        wordsList.head.value.incorrect_count =
          wordsList.head.value.incorrect_count + 1;
        wordsList.head.value.memory_value = 1;
        answer = false;
        wordsList.remove(currentNode.value);
        wordsList.insertAt(currentNode.value.memory_value, currentNode.value);
      }
      if (req.body.guess === wordsList.head.value.translation) {
        wordsList.head.value.correct_count += 1;
        wordsList.head.value.memory_value *= 2;
        userLang.total_score += 1;
        answer = true;
        if (wordsList.head.value.memory_value >= allWords.length) {
          wordsList.head.value.memory_value = allWords.length - 1;
        }
        wordsList.remove(currentNode.value);
        console.log(currentNode.value.memory_value);
        wordsList.insertAt(currentNode.value.memory_value, currentNode.value);
      }
      // TODO: print out linked list again

      // Update everything in the database, based on the linked-list `wordList`
      await LanguageService.serialize(req.app.get("db"), wordsList, userLang);
      res.json({
        currentWord: currentNode.head.value.original,
        nextWord: wordsList.head.value.original,
        totalScore: userLang.total_score,
        wordCorrectCount: wordsList.head.value.correct_count,
        wordIncorrectCount: wordsList.head.value.incorrect_count,
        answer: currentNode.value.translation,
        isCorrect: answer,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = languageRouter;
