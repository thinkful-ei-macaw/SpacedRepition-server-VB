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
      const nextWord = await LanguageService.getLanguageWords(
        req.app.get("db"),
        req.language.id
      );
      console.log(nextWord);
      const wordsList = LanguageService.createWordList(nextWord);
      if (req.body.guess !== wordsList.head.value.translation) {
        // wordsList.head.value.incorrect_count =
        //   wordsList.head.value.incorrect_count + 1;
        // while(wordsList.head.next !== null )
        wordsList.head.value.incorrect_count =
          wordsList.head.value.incorrect_count + 1;
        let currentNode = wordsList.head;

        wordsList.remove(currentNode.value);
        wordsList.insertAt(2, currentNode.value);
        await LanguageService.serialize(req.app.get("db"), wordsList);
        res.json({
          nextWord: wordsList.head.value.original,
          totalScore: req.language.total_score,
          wordCorrectCount: wordsList.head.value.correct_count,
          wordIncorrectCount: wordsList.head.value.incorrect_count,
          answer: currentNode.value.translation,
          isCorrect: false,
        });

        // return res.status(200).send().json({
        //   nextWord: wordsList.head.next.value.original,
        //   totalScore: req.language.total_score,
        //   wordCorrectCount: wordsList.head.value.correct_count,
        //   wordIncorrectCount: wordsList.head.value.incorrect_count,
        //   answer: wordsList.head.value.translation,
        //   isCorrect: false,
        // });
      }
      if (req.body.guess === nextWord[0].translation) {
        res.json({
          nextWord: nextWord[1].original,
          totalScore: req.language.total_score,
          wordCorrectCount: nextWord[0].correct_count,
          wordIncorrectCount: nextWord[0].incorrect_count,
          answer: nextWord[0].translation,
          isCorrect: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = languageRouter;
