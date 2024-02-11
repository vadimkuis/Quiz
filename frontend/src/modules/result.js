import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth.js";

export class Result {
  constructor() {

    this.routeParams = UrlManager.getQueryParams();
    this.init();

    const that = this;
    document.getElementById('results').onclick = function () {
      that.allAnswers(this);
    }
  }

  async init() {
    const userInfo = Auth.getUserInfo();
    if (!userInfo) {
      location.href = '#/';
    }

    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

        if (result) {
          if (result.error) {
            throw new Error(result.error);
          }
          document.getElementById('result-score').innerText = result.score + '/' + result.total;
          return;
        }
      } catch (error) {
        console.log(error)
      }
    }
    location.href = '#/';
  }

  allAnswers() {
    location.href = '#/answer?id=' + this.routeParams.id;
  }
}