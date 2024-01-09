#! /usr/bin/env node

import readlineSync from "readline-sync";
import Enquirer from "enquirer";

class NumberGuessingGame {
  constructor() {
    this.enquirer = new Enquirer();
  }

  async main() {
    console.log("数字当てゲームへようこそ！楽しんでいってください");

    let digitCount;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      digitCount = parseInt(
        readlineSync.question("挑戦する桁数を3,4,5から選んでください:"),
        10,
      );

      if (![3, 4, 5].includes(digitCount)) {
        console.log("3,4,5のうちから桁数を指定してください");
      } else {
        break;
      }
    }

    const { level } = await this.enquirer.prompt({
      type: "select",
      name: "level",
      message: "難易度を選択してください",
      choices: ["easy", "hard"],
    });

    const targetNumber = this.#generateRandomNumber(digitCount);
    let attempts = 0;

    console.log(`${digitCount}桁の数字を推理しましょう. (難易度: ${level})`);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const guess = readlineSync.question(
        `推測した${digitCount}桁の数字を入力してください:`,
      );

      if (guess.length !== digitCount || !/^\d+$/.test(guess)) {
        console.log(
          `桁数が間違っています ${digitCount}桁の数字を入力してください`,
        );
        continue;
      }

      attempts++;
      const detailedFeedback = this.#checkGuess(targetNumber, guess);

      if (level === "easy") {
        this.#displayDetailedFeedback(detailedFeedback);
      } else {
        this.#displayFeedback(detailedFeedback);
      }

      if (detailedFeedback.every((symbol) => symbol === "☆")) {
        console.log(
          `おめでとうございます! ${attempts}回目の回答で正解しました`,
        );
        break;
      }
    }
  }

  #generateRandomNumber(digitCount) {
    const numberSet = Array.from({ length: 10 }, (_, index) => index);
    for (let i = numberSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numberSet[i], numberSet[j]] = [numberSet[j], numberSet[i]];
    }
    return numberSet.slice(0, digitCount).join("");
  }

  #checkGuess(targetNumber, guess) {
    const detailedFeedback = [];

    for (let i = 0; i < targetNumber.length; i++) {
      const targetDigit = targetNumber[i];
      const guessDigit = guess[i];

      if (guessDigit === targetDigit) {
        detailedFeedback.push("☆");
      } else if (targetNumber.includes(guessDigit)) {
        detailedFeedback.push("△");
      } else {
        detailedFeedback.push("✕");
      }
    }

    return detailedFeedback;
  }

  #displayFeedback(detailedFeedback) {
    const feedback = { "☆": 0, "△": 0, "✕": 0 };
    detailedFeedback.forEach((symbol) => {
      feedback[symbol]++;
    });
    console.log(
      ` 推理結果(hard) ⇒  ☆:${feedback["☆"]} △:${feedback["△"]} ✕:${feedback["✕"]}`,
    );
  }

  #displayDetailedFeedback(detailedFeedback) {
    console.log(` 推理結果(easy) ⇒  ${detailedFeedback.join(" ")}`);
  }
}

const game = new NumberGuessingGame();
game.main();
