import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answer {

  constructor() {
    this.quiz = null;
    this.optionsElement = null;
    this.questionTitleElement = null;
    this.currentQuestionIndex = 1;
    this.routeParams = UrlManager.getQueryParams();

    this.init();

    const that = this;
    document.getElementById('results').onclick = function () {
      that.history(this);
    }
  }

  async init() {
    const userInfo = Auth.getUserInfo();
    if (!userInfo) {
      location.href = '#/';
    }

    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
        if (result) {
          if (result.error) {
            throw new Error(result.error);
          }
          document.getElementById('answer-info').innerText = userInfo.fullName + ', ' + userInfo.email;
          this.quiz = result;
          this.showQuestion();
          return;
        }
      } catch (error) {
        console.log(error)
      }
    }
    location.href = "#/"
  }

  showQuestion() {
    document.getElementById('pre-title').innerText = this.quiz.test.name;

    this.optionsElement = document.getElementById('answers');
    this.optionsElement.innerHTML = '';

    this.quiz.test.questions.forEach(question => {
      this.questionTitleElement = document.createElement('div');
      this.questionTitleElement.className = 'common-question-title';
      this.questionTitleElement.classList.add('answer-question-title');

      const optionElement = document.createElement('div');
      optionElement.className = 'common-question-options';

      this.questionTitleElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex + ':</span> ' + question.question;
      this.currentQuestionIndex++;
      optionElement.appendChild(this.questionTitleElement);

      question.answers.forEach(answer => {
        const answerItem = document.createElement('div');
        answerItem.className = 'common-question-option';

        const inputId = answer.id;

        const inputElement = document.createElement('input');
        inputElement.className = 'option-answer';
        inputElement.setAttribute('id', inputId);
        inputElement.setAttribute('type', 'radio');
        inputElement.setAttribute('name', 'answer');
        inputElement.setAttribute('value', answer.id);

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', inputId);
        labelElement.innerText = answer.answer;

        if (answer.correct === true) {
          labelElement.classList.add('answer-correct');
          inputElement.className = 'correct';
        }
        if (answer.correct === false) {
          labelElement.classList.add('answer-incorrect');
          inputElement.className = 'incorrect';
        }

        answerItem.appendChild(inputElement);
        answerItem.appendChild(labelElement);
        optionElement.appendChild(answerItem);
      });

      this.optionsElement.appendChild(optionElement);
    });
  }

  history() {
    location.href = '#/result?id=' + this.routeParams.id;
  }
}