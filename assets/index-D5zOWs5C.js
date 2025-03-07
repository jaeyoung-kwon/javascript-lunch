(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const createDOMElement = ({ tag, children, ...props }) => {
  if (!tag) throw new Error("Tag is required");
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "class") {
      if (Array.isArray(value)) {
        value.forEach((className) => {
          element.classList.add(className);
        });
      } else {
        element.className = value;
      }
    }
    element[key] = value;
  });
  if (children) {
    children.forEach((child) => {
      element.appendChild(child);
    });
  }
  return element;
};
function Header({ title, right }) {
  return createDOMElement({
    tag: "header",
    class: "gnb",
    children: [
      createDOMElement({
        tag: "h1",
        class: ["gnb__title", "text-title"],
        textContent: title
      }),
      right
    ]
  });
}
function PlusButton() {
  return createDOMElement({
    tag: "button",
    type: "button",
    class: "gnb__button",
    "aria-label": "음식점 추가",
    children: [
      createDOMElement({
        tag: "img",
        src: "images/add-button.png",
        alt: "음식점 추가"
      })
    ]
  });
}
function Modal({ content }) {
  const modal = createDOMElement({
    tag: "div",
    class: "modal",
    children: [
      createDOMElement({
        tag: "div",
        class: "modal-backdrop"
      }),
      content
    ]
  });
  function open() {
    modal.classList.add("modal--open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscKey);
  }
  function close() {
    modal.classList.remove("modal--open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleEscKey);
  }
  function handleEscKey(event) {
    if (event.key === "Escape") {
      close();
    }
  }
  modal.querySelector(".modal-backdrop").addEventListener("click", close);
  return { modal, open, close };
}
const CATEGORY_OPTIONS = [
  { value: "", option: "선택해 주세요" },
  { value: "korean", option: "한식" },
  { value: "chinese", option: "중식" },
  { value: "japanese", option: "일식" },
  { value: "western", option: "양식" },
  { value: "asian", option: "아시안" },
  { value: "etc", option: "기타" }
];
const DISTANCE_OPTIONS = [
  { value: "", option: "선택해 주세요" },
  { value: "5", option: "5분 내" },
  { value: "10", option: "10분 내" },
  { value: "15", option: "15분 내" },
  { value: "20", option: "20분 내" },
  { value: "30", option: "30분 내" }
];
function ActionButton({ text }) {
  return createDOMElement({
    tag: "button",
    class: ["button", "button--secondary", "text-caption"],
    textContent: text
  });
}
function CTAButton({ text, ...attribute }) {
  return createDOMElement({
    tag: "button",
    class: ["button", "button--primary", "text-caption"],
    textContent: text,
    ...attribute
  });
}
function Root({ label, input, caption }) {
  return createDOMElement({
    tag: "div",
    class: ["form-item", "form-item--required"],
    children: [label, input, caption].filter(Boolean)
  });
}
function Label({ text, className, ...attribute }) {
  return createDOMElement({
    tag: "label",
    textContent: text,
    class: [className, "text-caption"].filter(Boolean),
    ...attribute
  });
}
function Select({ options, ...attribute }) {
  return createDOMElement({
    tag: "select",
    children: options.map(
      ({ value, option }) => createDOMElement({
        tag: "option",
        value,
        textContent: option
      })
    ),
    ...attribute
  });
}
function Input({ ...attribute }) {
  return createDOMElement({
    tag: "input",
    ...attribute
  });
}
function TextArea({ ...attribute }) {
  return createDOMElement({
    tag: "textarea",
    ...attribute
  });
}
function Caption({ text }) {
  return createDOMElement({
    tag: "span",
    class: ["help-text", "text-caption"],
    textContent: text
  });
}
const InputBox = { Root, Label, Select, Input, Select, TextArea, Caption };
function RestaurantAddModalForm() {
  const CancelButton = ActionButton({ text: "취소하기" });
  const AddButton = CTAButton({ text: "추가하기", type: "submit" });
  return createDOMElement({
    tag: "form",
    children: [
      InputBox.Root({
        label: InputBox.Label({ text: "카테고리", for: "category", className: "label-required" }),
        input: InputBox.Select({
          name: "category",
          id: "category",
          options: CATEGORY_OPTIONS,
          required: true
        })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "이름", for: "name", className: "label-required" }),
        input: InputBox.Input({ type: "text", name: "name", id: "name", required: true })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "거리(도보 이동 시간)", for: "distance", className: "label-required" }),
        input: InputBox.Select({
          name: "distance",
          id: "distance",
          options: DISTANCE_OPTIONS,
          required: true
        })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "설명", for: "description" }),
        input: InputBox.TextArea({
          name: "description",
          id: "description",
          cols: "30",
          rows: "5"
        }),
        caption: InputBox.Caption({
          text: "메뉴 등 추가 정보를 입력해 주세요."
        })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "참고 링크" }),
        input: InputBox.Input({
          type: "text",
          name: "link",
          id: "link"
        }),
        caption: InputBox.Caption({
          text: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
        })
      }),
      createDOMElement({
        tag: "div",
        class: "button-container",
        children: [CancelButton, AddButton]
      })
    ]
  });
}
function RestaurantAddModal() {
  return Modal({
    content: createDOMElement({
      tag: "div",
      class: "modal-container",
      children: [
        createDOMElement({
          tag: "h2",
          class: ["modal-title", "text-title"],
          textContent: "새로운 음식점"
        }),
        RestaurantAddModalForm()
      ]
    })
  });
}
function RestaurantIcon({ src, alt }) {
  return createDOMElement({
    tag: "img",
    src,
    alt,
    class: "category-icon"
  });
}
function RestaurantItem({ name, distance, description, icon }) {
  return createDOMElement({
    tag: "li",
    class: "restaurant",
    children: [
      createDOMElement({
        tag: "div",
        class: "restaurant__category",
        children: [icon]
      }),
      createDOMElement({
        tag: "div",
        class: "restaurant__info",
        children: [
          createDOMElement({
            tag: "h3",
            class: ["restaurant__name", "text-subtitle"],
            textContent: name
          }),
          createDOMElement({
            tag: "span",
            class: ["restaurant__distance", "text-body"],
            textContent: `캠퍼스부터 ${distance}분 내`
          }),
          createDOMElement({
            tag: "p",
            class: ["restaurant__description", "text-body"],
            textContent: description
          })
        ]
      })
    ]
  });
}
const restaurants = [
  {
    name: "피양콩할마니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    icon: {
      src: "images/category-korean.png",
      alt: "korean"
    }
  },
  {
    name: "친친",
    distance: 5,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    icon: {
      src: "images/category-chinese.png",
      alt: "chinese"
    }
  },
  {
    name: "잇쇼우",
    distance: 10,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
    icon: {
      src: "images/category-japanese.png",
      alt: "japanese"
    }
  },
  {
    name: "이태리키친",
    distance: 20,
    description: "늘 변화를 추구하는 이태리키친입니다.",
    icon: {
      src: "images/category-western.png",
      alt: "western"
    }
  },
  {
    name: "호아빈 삼성점",
    distance: 15,
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    icon: {
      src: "images/category-asian.png",
      alt: "asian"
    }
  },
  {
    name: "도스타코스 선릉점",
    distance: 5,
    description: "멕시칸 캐주얼 그릴",
    icon: {
      src: "images/category-etc.png",
      alt: "etc"
    }
  }
];
function RestaurantList() {
  return createDOMElement({
    tag: "section",
    class: "restaurant-list-container",
    children: [
      createDOMElement({
        tag: "ul",
        class: "restaurant-list",
        children: restaurants.map(
          (restaurant) => RestaurantItem({ ...restaurant, icon: RestaurantIcon(restaurant.icon) })
        )
      })
    ]
  });
}
function $(selector) {
  return document.querySelector(selector);
}
const renderHeader = () => {
  const body = $("body");
  const header = Header({ title: "점심 뭐 먹지", right: PlusButton() });
  body.prepend(header);
};
const renderRestaurantList = () => {
  const main = $("main");
  main.appendChild(RestaurantList());
};
const renderModal = () => {
  const main = $("main");
  const { modal: restaurantAddModal, open, close } = RestaurantAddModal();
  main.appendChild(restaurantAddModal);
  attachModalEvents(open, close);
};
const attachModalEvents = (open, close) => {
  const plusButton = $(".gnb__button");
  plusButton.addEventListener("click", open);
  const closeButton = $(".button--secondary");
  closeButton.addEventListener("click", close);
  const form = $("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    handleSubmit(data);
    form.reset();
    close();
  });
};
const handleSubmit = ({ name, distance, description, category }) => {
  const item = RestaurantItem({
    name,
    distance,
    description,
    icon: RestaurantIcon({ src: `images/category-${category}.png`, alt: category })
  });
  $(".restaurant-list").appendChild(item);
};
renderHeader();
renderRestaurantList();
renderModal();
