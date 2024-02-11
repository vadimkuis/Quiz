import {Form} from "./modules/form.js";
import {Choice} from "./modules/choice.js";
import {Test} from "./modules/test.js";
import {Result} from "./modules/result.js";
import {Answer} from "./modules/answer.js";
import {Auth} from "./services/auth.js";

export class Router {
  constructor() {

    this.contentElement = document.getElementById('content');
    this.stylesElement = document.getElementById('styles');
    this.titleElement = document.getElementById('title');
    this.profileElement = document.getElementById('profile');
    this.profileFullNElement = document.getElementById('profile-full-name');

    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.current-year');
    yearElement.textContent = currentYear.toString();

    this.routes = [
      {
        route: '#/',
        title: 'Главная',
        template: 'templates/index.html',
        styles: 'styles/index.css',
        load: () => {
        }
      },
      {
        route: '#/signup',
        title: 'Регистрация',
        template: 'templates/signup.html',
        styles: 'styles/form.css',
        load: () => {
          new Form('signup');
        }
      },
      {
        route: '#/login',
        title: 'Вход в систему',
        template: 'templates/login.html',
        styles: 'styles/form.css',
        load: () => {
          new Form('login');
        }
      },
      {
        route: '#/choice',
        title: 'Выбор теста',
        template: 'templates/choice.html',
        styles: 'styles/choice.css',
        load: () => {
          new Choice();
        }
      },
      {
        route: '#/test',
        title: 'Прохождение теста',
        template: 'templates/test.html',
        styles: 'styles/test.css',
        load: () => {
          new Test();
        }
      },
      {
        route: '#/result',
        title: 'Результаты',
        template: 'templates/result.html',
        styles: 'styles/result.css',
        load: () => {
          new Result();
        }
      },
      {
        route: '#/answer',
        title: 'Правильные ответы',
        template: 'templates/answer.html',
        styles: 'styles/answer.css',
        load: () => {
          new Answer();
        }
      },
    ]
  }

  async openRote() {
    const urlRoute = window.location.hash.split('?')[0];
    if (urlRoute === '#/logout') {
      Auth.logout();
      window.location.href = '#/';
      return;
    }

    const newRoute = this.routes.find(item => {
      return item.route === urlRoute;
    });

    if (!newRoute) {
      window.location.href = '#/';
      return;
    }

    this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
    this.stylesElement.setAttribute('href', newRoute.styles);
    this.titleElement.innerText = newRoute.title;

    const userInfo = Auth.getUserInfo();
    const accessToken = localStorage.getItem(Auth.accessTokenKey);
    if (userInfo && accessToken) {
      this.profileElement.style.display = 'flex';
      this.profileFullNElement.innerText = userInfo.fullName;
    } else {
      this.profileElement.style.display = 'none';
    }

    newRoute.load();
  }
}