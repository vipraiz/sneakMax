let lazyQuiz = true;

const quizData = [
  {
    number: 1,
    title: "Какой тип кроссовок рассматриваете?",
    answer_alias: "type",
    answers: [
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
    ],
  },
  {
    number: 2,
    title: "Какой размер вам подойдет?",
    answer_alias: "size",
    answers: [
      {
        answer_title: "менее 36",
        type: "checkbox",
      },
      {
        answer_title: "36-38",
        type: "checkbox",
      },
      {
        answer_title: "39-41",
        type: "checkbox",
      },
      {
        answer_title: "42-44",
        type: "checkbox",
      },
      {
        answer_title: "45 и больше",
        type: "checkbox",
      },
    ],
  },
  {
    number: 3,
    title: "Уточните какие-либо моменты (необязательно)",
    answer_alias: "message",
    answers: [
      {
        answer_title: "Введите сообщение",
        type: "textarea",
      },
    ],
  },
];

const quizTemplate = (data = [], dataLength = 0, options) => {
  const { number, title } = data;
  const { nextBtnText } = options;
  const answers = data.answers.map((item) => {
    if (item.type === "checkbox") {
      return `
      <li class="quiz-question__item">
        <label class="custom-checkbox quiz-question__label">
          <div class="quiz-question__image">
          ${
            lazyQuiz
              ? `
            <img
              src="img/sneaker.jpg"
              class="lozad"
              data-srcset="img/sneaker.jpg 100w"
              srcset="img/placeholder.svg 100w"
              sizes="100vw"
              alt="${item.title}"
            />
          `
              : `
            <img
              src="img/sneaker.jpg"
              alt="${item.title}"
            />
          `
          }
          </div>
          <input type="${item.type}"
            class="custom-checkbox__field quiz-question__answer"
            data-valid="false"
            name="${data.answer_alias}"
            ${item.type == "text" ? 'placeholder="Введите ваш вариант"' : ""}
            value="${item.type !== "text" ? item.answer_title : ""}">
          <span class="custom-checkbox__content">${item.answer_title}</span>
        </label>
      </li>`;
    }
    if (item.type === "textarea") {
      return `
      <li class="quiz-question__item">
        <label class="quiz-question__label">
          <textarea class="quiz-question__message" placeholder="${item.answer_title}"></textarea>
        </label>
      </li>`;
    }
    return `
    <li class="quiz-question__item">
      <label class="quiz-question__label">
        <input type="${item.type}"
          data-valid="false"
          class="quiz-question__answer"
          name="${data.answer_alias}"
          ${item.type == "text" ? 'placeholder="Введите ваш вариант"' : ""}
          value="${item.type !== "text" ? item.answer_title : ""}">
        <span>${item.answer_title}</span>
      </label>
    </li>`;
  });

  return `
    <h3 class="quiz-question__title">${title}</h3>
    <ul class="quiz-question__answers list-reset">
      ${answers.join("")}
    </ul>
    <div class="quiz-bottom">
      <div class="quiz-question__count">${number} из ${dataLength}</div>
      <button type="button" class="btn btn-reset btn_thirdly quiz-question__btn" data-next-btn>${nextBtnText}</button>
    </div>
	`;
};

class Quiz {
  constructor(selector, data, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.data = data;
    this.counter = 0;
    this.dataLength = this.data.length;
    this.resultArray = [];
    this.tmp = {};
    this.init();
    this.events();
  }

  init() {
    this.$el.innerHTML = quizTemplate(
      this.data[this.counter],
      this.dataLength,
      this.options
    );
    if (lazyQuiz) {
      observer.observe();
    }
  }

  nextQuestion() {
    if (this.valid()) {
      if (this.counter + 1 < this.dataLength) {
        this.counter++;
        this.$el.innerHTML = quizTemplate(
          this.data[this.counter],
          this.dataLength,
          this.options
        );
        if (lazyQuiz) {
          observer.observe();
        }

        if (this.counter + 1 == this.dataLength) {
          document.querySelector(".quiz-question__answers").style.display =
            "block";
        }
      } else {
        document.querySelector(".quiz-questions").style.display = "none";
        const lastQuestion = document.querySelector(".last-question");
        lastQuestion.innerHTML = `
          <div class="last-question__form">
            <h3 class="last-question__title">Получить предложение</h3>
            <p class="last-question__descr">
              Получите подборку подходящих для вас моделей на почту
            </p>
            <input
              type="text"
              class="input last-question__input"
              placeholder="Ваше имя"
            />
            <input
              type="email"
              class="input last-question__input"
              placeholder="E-mail"
            />
            <button class="btn btn_primary btn-reset last-question__btn">
              Получить
            </button>
            ${
              lazyQuiz
                ? `
              <div class="last-question__decorate lozad" data-background-image="img/iphone.png" style="background-image: url('img/placeholder.svg')"></div>
            `
                : `
              <div class="last-question__decorate" style="background-image: url(../img/iphone.png)"></div>
            `
            }
          </div>
        `;
        lastQuestion.style.display = "block";

        document.querySelector(".quiz__title").textContent =
          "Ваша подборка готова!";
        document.querySelector(".quiz__descr").textContent =
          "Оставьте свои контактные данные, чтобы бы мы могли отправить  подготовленный для вас каталог";
      }
    }
  }

  events() {
    this.$el.addEventListener("click", (e) => {
      if (e.target == document.querySelector("[data-next-btn]")) {
        lazyQuiz = false;
        this.addToSend();
        this.nextQuestion();
      }

      if (e.target == document.querySelector("[data-send]")) {
        this.send();
      }
    });

    this.$el.addEventListener("change", (e) => {
      if (e.target.tagName == "INPUT") {
        if (e.target.type !== "checkbox" && e.target.type !== "radio") {
          let elements = this.$el.querySelectorAll("input");

          elements.forEach((el) => {
            el.checked = false;
          });
        }
        this.tmp = this.serialize(this.$el);
      }
    });
  }

  valid() {
    let textarea = this.$el.querySelector("textarea");
    if (textarea) {
      return true;
    }
    let isValid = false;

    let elements = this.$el.querySelectorAll("input");
    elements.forEach((el) => {
      switch (el.nodeName) {
        case "INPUT":
          switch (el.type) {
            case "text":
              isValid = true;
              if (el.value) {
                isValid = true;
              } else {
                el.classList.add("error");
              }
            case "checkbox":
              if (el.checked) {
                isValid = true;
              } else {
                el.classList.add("error");
              }
            case "radio":
              if (el.checked) {
                isValid = true;
              } else {
                el.classList.add("error");
              }
          }
      }
    });

    return isValid;
  }

  addToSend() {
    this.resultArray.push(this.tmp);
  }

  send() {
    if (this.valid()) {
      const formData = new FormData();

      for (let item of this.resultArray) {
        for (let obj in item) {
          formData.append(obj, item[obj].substring(0, item[obj].length - 1));
        }
      }

      const response = fetch("mail.php", {
        method: "POST",
        body: formData,
      });
    }
  }

  serialize(form) {
    let field,
      s = {};
    let valueString = "";
    if (typeof form == "object" && form.nodeName == "FORM") {
      let len = form.elements.length;
      for (let i = 0; i < len; i++) {
        field = form.elements[i];

        if (
          field.name &&
          !field.disabled &&
          field.type != "file" &&
          field.type != "reset" &&
          field.type != "submit" &&
          field.type != "button"
        ) {
          if (field.type == "select-multiple") {
            for (j = form.elements[i].options.length - 1; j >= 0; j--) {
              if (field.options[j].selected)
                s[s.length] =
                  encodeURIComponent(field.name) +
                  "=" +
                  encodeURIComponent(field.options[j].value);
            }
          } else if (
            (field.type != "checkbox" &&
              field.type != "radio" &&
              field.value) ||
            field.checked
          ) {
            valueString += field.value + ",";

            s[field.name] = valueString;
          }
        }
      }
    }
    return s;
  }
}

window.quiz = new Quiz(".quiz-form .quiz-questions", quizData, {
  nextBtnText: "Следующий шаг",
  sendBtnText: "Отправить",
});
