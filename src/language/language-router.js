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
    next();
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
      res.status(400).send({ error: "Missing 'guess' in request body" });
    }
    try {
      const nextWord = await LanguageService.getLanguageWords(
        req.app.get("db"),
        req.language.id
      );
      const wordsList = LanguageService.createWordList(nextWord);
      console.log(wordsList);
      if (req.body.guess !== wordsList.head.value.translation) {
        res.json({
          nextWord: wordsList.head.next.value.original,
          totalScore: req.language.total_score,
          wordCorrectCount: wordsList.head.value.correct_count,
          wordIncorrectCount: wordsList.head.value.incorrect_count++,
          answer: wordsList.head.value.translation,
          isCorrect: false,
        });

        res.status(200).send();
        next();
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
