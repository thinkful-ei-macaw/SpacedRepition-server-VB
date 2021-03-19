# Spaced repetition API

# Spaced repetition Server

## Introduction

- Learning spanish one word at a time.

- Learn in repetition.

- This is a spanish translator app, that has been produced utilizing a linked list data structure, and a specific algorithm mentioned above

- You will see the words you get wrong more often to get more practice.

- The user can see their current total score, how many times they have gotten a word wrong and right. As well as a nice message congratulating the user

## heroku link:

https://spaced-repetition-api-vb.herokuapp.com/

## link to live app:

https://spaced-repetition-three.now.sh/

## link to server repo:

https://github.com/thinkful-ei-macaw/SpacedRepition-server-VB

## link to client repo:

https://github.com/thinkful-ei-macaw/SpacedRepition-client-VB

## Partners: Vendy Prum and Brannen Petit

### Tech-Stack:

- ReactJs
- NodeJs
- Express
- HTML
- JSX
- CSS
- queue, linkedlist
- heroku

### API Docs:

- POST
  - REQUEST: https://spaced-repetition-api-vb.herokuapp.com/api/auth/token
  - allows user's to login and get authorization token
  - RESPONSE: 200 OK {
    authToken: returns authToken
    }
- PUT
  - REQUEST: https://spaced-repetition-api-vb.herokuapp.com/api/auth/
  - Updates the user's auth token, this is a refreshing situation
  - RESPONSE: 200 OK {
    authToken: returns authToken
    }
- POST

  - REQUEST: https://spaced-repetition-api-vb.herokuapp.com/api/users/
  - Allows users to sign up on the app
  - RESPONSE: 201 OK

- GET

  - REQUEST: https://spaced-repetition-api-vb.herokuapp.com/api/language/
  - retrieves the user's words from the database to poplulate the dashboard
  - RESPONSE: 200 {
    langauge: 2,
    words: ['felicidad', 'amor', 'etc..']
    }

  - GET
  - REQUEST: https://spaced-repetition-api-vb.herokuapp.com/api/language/head
  - retrieves the user next word to start practicing at the head of the linked-list
  - RESPONSE: 200 {
    currentWord: "felicidad",
    nextWord: "hola",
    totalScore: 10,
    wordCorrectCount: 2,
    wordIncorrectCount: 3,
    }

  - POST
  - REQUEST: https://spaced-repetition-api-vb.herokuapp.com/api/language/guess
  - interprets the users guess for the current word they are learning
  - RESPONSE: 200 {
    currentWord: "felicidad",
    nextWord: "hola",
    totalScore: 3,
    wordCorrectCount: 2,
    wordIncorrectCount: 3,
    answer: "happiness,
    isCorrect: True,
    }

### Summary

- This app allows users to view their current spanish words, that they are attempting to learn
- This apps allows users cycle through different words
- This app allows users to submit a guess for each word in their list
- This app provides the user feedback on whether or not they got a words translation correct or not
- This app shows the user their total score and allows them to go back to the dashboard to see all their words

# SpacedRepition-server-VB
