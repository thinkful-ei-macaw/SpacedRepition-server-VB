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
      const userLang = await LanguageService.getUsersLanguage(
        req.app.get("db"),
        req.language.user_id
      );
      console.log("heheheheifhefiveve", userLang);
      const wordsList = LanguageService.createWordList(nextWord);
      let answer;
      let currentNode = wordsList.head;
      if (req.body.guess !== wordsList.head.value.translation) {
        wordsList.head.value.incorrect_count =
          wordsList.head.value.incorrect_count + 1;
        wordsList.head.value.memory_value = 1;
        answer = false;
        wordsList.remove(currentNode.value);
        wordsList.insertAt(currentNode.value.memory_value, currentNode.value);
      }
      if (req.body.guess === wordsList.head.value.translation) {
        let value = wordsList.head.value.memory_value;
        wordsList.head.value.correct_count =
          wordsList.head.value.correct_count + 1;
        wordsList.head.value.memory_value = value === 1 ? value + 2 : value * 2;
        userLang.total_score = userLang.total_score + 1;
        answer = true;
        wordsList.remove(currentNode.value);
        wordsList.insertAt(currentNode.value.memory_value, currentNode.value);
      }

      await LanguageService.serialize(req.app.get("db"), wordsList, userLang);
      res.json({
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
