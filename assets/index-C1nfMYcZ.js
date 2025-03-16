var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _restaurants, _filter, _Restaurants_instances, filterByCategory_fn, sortByOption_fn, _onFilterChange, _FilterController_instances, bindEvents_fn, _ModalController_instances, renderModalContent_fn, attachCancelEvent_fn, attachFormSubmitEvent_fn, attachDetailModalEvents_fn, _restaurants2, _onToggleFavorite, _onSelectRestaurant, _RestaurantListController_instances, bindEvents_fn2, _container, _currentTab, _onTabChange, _TabController_instances, bindEvents_fn3, _AppController_instances, onTabChange_fn, onFilterChange_fn, addRestaurantItem_fn;
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
      } else if (typeof value === "string") {
        value.split(" ").forEach((className) => {
          if (className !== "") element.classList.add(className);
        });
      }
    }
    if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child) element.appendChild(child);
      });
    } else {
      element.appendChild(children);
    }
  }
  return element;
};
function PlusButton({ onclick, ...attribute }) {
  return createDOMElement({
    tag: "button",
    type: "button",
    class: "gnb__button",
    onclick,
    ...attribute,
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
function Header({ title, right }) {
  return createDOMElement({
    tag: "header",
    class: "gnb",
    children: [
      createDOMElement({
        tag: "h1",
        class: "gnb__title text-title",
        textContent: title
      }),
      right
    ]
  });
}
class Restaurants {
  constructor() {
    __privateAdd(this, _Restaurants_instances);
    __privateAdd(this, _restaurants);
    __privateAdd(this, _filter);
    const localRestaurants = localStorage.getItem("restaurants");
    __privateSet(this, _restaurants, localRestaurants ? JSON.parse(localRestaurants) : []);
    __privateSet(this, _filter, { category: "all", sort: "latest" });
  }
  get items() {
    return [...__privateGet(this, _restaurants)];
  }
  addRestaurant(restaurant) {
    __privateGet(this, _restaurants).push(restaurant);
    localStorage.setItem("restaurants", JSON.stringify(__privateGet(this, _restaurants)));
  }
  removeRestaurant(restaurantName) {
    __privateSet(this, _restaurants, __privateGet(this, _restaurants).filter((restaurant) => restaurant.name !== restaurantName));
    localStorage.setItem("restaurants", JSON.stringify(__privateGet(this, _restaurants)));
  }
  toggleFavoriteRestaurant(restaurantName) {
    const restaurant = __privateGet(this, _restaurants).find((restaurant2) => restaurant2.name === restaurantName);
    if (restaurant) {
      restaurant.isFavorite = !restaurant.isFavorite;
      localStorage.setItem("restaurants", JSON.stringify(__privateGet(this, _restaurants)));
    }
  }
  getRestaurantByFilter(type, value) {
    __privateGet(this, _filter)[type] = value;
    const filteredRestaurants = __privateMethod(this, _Restaurants_instances, filterByCategory_fn).call(this);
    return __privateMethod(this, _Restaurants_instances, sortByOption_fn).call(this, filteredRestaurants);
  }
  getFavoriteRestaurants() {
    return __privateGet(this, _restaurants).filter((restaurant) => restaurant.isFavorite);
  }
}
_restaurants = new WeakMap();
_filter = new WeakMap();
_Restaurants_instances = new WeakSet();
filterByCategory_fn = function() {
  if (__privateGet(this, _filter).category === "all") {
    return [...__privateGet(this, _restaurants)];
  }
  return __privateGet(this, _restaurants).filter((restaurant) => __privateGet(this, _filter).category === restaurant.category);
};
sortByOption_fn = function(restaurants) {
  if (__privateGet(this, _filter).sort === "latest") {
    return [...restaurants];
  }
  return [...restaurants].sort((a, b) => {
    if (__privateGet(this, _filter).sort === "name") {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }
    return a.distance - b.distance;
  });
};
function $(selector, element = document) {
  return element.querySelector(selector);
}
function $all(selector, element = document) {
  return element.querySelectorAll(selector);
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
function CategoryFilter() {
  const CATEGORY_FILTER_OPTIONS = [
    { value: "all", option: "전체" },
    ...CATEGORY_OPTIONS.filter((category) => category.value !== "")
  ];
  return createDOMElement({
    tag: "select",
    name: "category",
    id: "category-filter",
    class: "restaurant-filter",
    children: CATEGORY_FILTER_OPTIONS.map(
      (category) => createDOMElement({
        tag: "option",
        value: category.value,
        textContent: category.option
      })
    )
  });
}
function SortFilter() {
  return createDOMElement({
    tag: "select",
    name: "sorting",
    id: "sorting-filter",
    class: "restaurant-filter",
    children: [
      createDOMElement({
        tag: "option",
        value: "latest",
        textContent: "최신순"
      }),
      createDOMElement({
        tag: "option",
        value: "name",
        textContent: "이름순"
      }),
      createDOMElement({
        tag: "option",
        value: "distance",
        textContent: "거리순"
      })
    ]
  });
}
function RestaurantFilterContainer() {
  return createDOMElement({
    tag: "section",
    class: "restaurant-filter-container",
    children: [CategoryFilter(), SortFilter()]
  });
}
const RestaurantFilterView = {
  render() {
    const main = $("main");
    const tabContainer = $(".restaurant-tab-container");
    const filterContainer = RestaurantFilterContainer();
    if (tabContainer) {
      tabContainer.after(filterContainer);
    } else {
      main == null ? void 0 : main.appendChild(filterContainer);
    }
  },
  remove() {
    const filterContainer = $(".restaurant-filter-container");
    filterContainer == null ? void 0 : filterContainer.remove();
  }
};
class FilterController {
  constructor(onFilterChange) {
    __privateAdd(this, _FilterController_instances);
    __privateAdd(this, _onFilterChange);
    __privateSet(this, _onFilterChange, onFilterChange);
  }
  render() {
    RestaurantFilterView.render();
    __privateMethod(this, _FilterController_instances, bindEvents_fn).call(this);
  }
  remove() {
    RestaurantFilterView.remove();
  }
}
_onFilterChange = new WeakMap();
_FilterController_instances = new WeakSet();
bindEvents_fn = function() {
  var _a, _b;
  (_a = $("#category-filter")) == null ? void 0 : _a.addEventListener("change", (event) => {
    var _a2;
    __privateGet(this, _onFilterChange).call(this, "category", (_a2 = event.target) == null ? void 0 : _a2.value);
  });
  (_b = $("#sorting-filter")) == null ? void 0 : _b.addEventListener("change", (event) => {
    var _a2;
    __privateGet(this, _onFilterChange).call(this, "sort", (_a2 = event.target) == null ? void 0 : _a2.value);
  });
};
function FavoriteButton({ onclick, isFavorite, isDetail = false, ...attribute }) {
  return createDOMElement({
    tag: "button",
    type: "button",
    class: `restaurant__favorite-button ${isDetail ? "restaurant__favorite-button--detail" : ""}`,
    onclick,
    ...attribute,
    "aria-label": "음식점 추가",
    children: [
      createDOMElement({
        tag: "img",
        src: isFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png",
        alt: "음식점 추가"
      })
    ]
  });
}
function Modal({ content }) {
  const modalBackdrop = createDOMElement({
    tag: "div",
    class: "modal-backdrop"
  });
  const modal = createDOMElement({
    tag: "div",
    class: "modal",
    children: [modalBackdrop, content]
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
  modalBackdrop.addEventListener("click", close);
  return { modal, open, close };
}
function ActionButton({ text, onclick, ...attribute }) {
  return createDOMElement({
    tag: "button",
    class: "button button--secondary text-caption",
    onclick,
    textContent: text,
    ...attribute
  });
}
function CTAButton({ text, onclick, ...attribute }) {
  return createDOMElement({
    tag: "button",
    class: "button button--primary text-caption",
    onclick,
    textContent: text,
    ...attribute
  });
}
function Root({ label, input, caption }) {
  return createDOMElement({
    tag: "div",
    class: "form-item form-item--required",
    children: [label, input, caption]
  });
}
function Label({ text, className, ...attribute }) {
  return createDOMElement({
    tag: "label",
    textContent: text,
    class: `${className} text-caption`,
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
    class: "help-text text-caption",
    textContent: text
  });
}
const InputBox = { Root, Label, Select, Input, TextArea, Caption };
function RestaurantAddModalForm() {
  return createDOMElement({
    tag: "form",
    children: [
      InputBox.Root({
        label: InputBox.Label({ text: "카테고리", htmlFor: "category", className: "label-required" }),
        input: InputBox.Select({
          name: "category",
          id: "category",
          options: CATEGORY_OPTIONS,
          required: true
        })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "이름", htmlFor: "name", className: "label-required" }),
        input: InputBox.Input({ type: "text", name: "name", id: "name", required: true })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "거리(도보 이동 시간)", htmlFor: "distance", className: "label-required" }),
        input: InputBox.Select({
          name: "distance",
          id: "distance",
          options: DISTANCE_OPTIONS,
          required: true
        })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "설명", htmlFor: "description" }),
        input: InputBox.TextArea({
          name: "description",
          id: "description",
          cols: 30,
          rows: 5
        }),
        caption: InputBox.Caption({
          text: "메뉴 등 추가 정보를 입력해 주세요."
        })
      }),
      InputBox.Root({
        label: InputBox.Label({ text: "참고 링크", htmlFor: "link" }),
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
        children: [
          ActionButton({ id: "restaurantAddModalCancelButton", text: "취소하기", type: "button" }),
          CTAButton({ id: "restaurantAddModalSubmitButton", text: "추가하기", type: "submit" })
        ]
      })
    ]
  });
}
function RestaurantAddModalContent() {
  return createDOMElement({
    tag: "div",
    class: "modal-container",
    children: [
      createDOMElement({
        tag: "h2",
        class: "modal-title text-title",
        textContent: "새로운 음식점"
      }),
      RestaurantAddModalForm()
    ]
  });
}
function RestaurantIcon({ category }) {
  return createDOMElement({
    tag: "img",
    src: `images/category-${category}.png`,
    alt: category,
    class: "category-icon"
  });
}
function RestaurantDetailInfo({ restaurant }) {
  return createDOMElement({
    tag: "div",
    class: "restaurant-detail-container",
    children: [
      createDOMElement({
        tag: "div",
        class: "restaurant__category",
        children: [RestaurantIcon({ category: restaurant.category })]
      }),
      createDOMElement({
        tag: "h3",
        class: "restaurant__name text-subtitle",
        textContent: restaurant.name
      }),
      createDOMElement({
        tag: "span",
        class: "restaurant__distance text-body",
        textContent: `캠퍼스부터 ${restaurant.distance}분 내`
      }),
      createDOMElement({
        tag: "p",
        class: "text-body",
        textContent: restaurant.description
      }),
      createDOMElement({
        tag: "p",
        class: "restaurant__link text-body",
        textContent: restaurant.link
      })
    ]
  });
}
function RestaurantDetailModalContent({ restaurant }) {
  return createDOMElement({
    tag: "div",
    class: "modal-container",
    children: [
      RestaurantDetailInfo({ restaurant }),
      createDOMElement({
        tag: "div",
        class: "button-container",
        children: [ActionButton({ text: "삭제하기", type: "button" }), CTAButton({ text: "닫기", type: "submit" })]
      }),
      FavoriteButton({ isFavorite: restaurant.isFavorite, isDetail: true })
    ]
  });
}
function RestaurantItem({ restaurant }) {
  return createDOMElement({
    tag: "li",
    class: "restaurant",
    "data-id": restaurant.name,
    children: [
      createDOMElement({
        tag: "div",
        class: "restaurant__category",
        children: [RestaurantIcon({ category: restaurant.category })]
      }),
      createDOMElement({
        tag: "div",
        class: "restaurant__info",
        children: [
          createDOMElement({
            tag: "h3",
            class: "restaurant__name text-subtitle",
            textContent: restaurant.name
          }),
          createDOMElement({
            tag: "span",
            class: "restaurant__distance text-body",
            textContent: `캠퍼스부터 ${restaurant.distance}분 내`
          }),
          createDOMElement({
            tag: "p",
            class: "restaurant__description text-body",
            textContent: restaurant.description
          })
        ]
      }),
      FavoriteButton({ isFavorite: restaurant.isFavorite })
    ]
  });
}
function RestaurantList({ restaurants }) {
  return createDOMElement({
    tag: "ul",
    class: "restaurant-list",
    children: restaurants.map((restaurant) => RestaurantItem({ restaurant }))
  });
}
function RestaurantListContainer({ restaurants }) {
  return createDOMElement({
    tag: "section",
    class: "restaurant-list-container",
    children: RestaurantList({ restaurants })
  });
}
const RestaurantListView = {
  render(restaurants) {
    const main = $("main");
    const container = RestaurantListContainer({ restaurants });
    main == null ? void 0 : main.appendChild(container);
  },
  updateList(restaurants) {
    const restaurantListDOM = $(".restaurant-list");
    const newRestaurantList = RestaurantList({ restaurants });
    restaurantListDOM == null ? void 0 : restaurantListDOM.replaceWith(newRestaurantList);
  },
  addItem(restaurant) {
    const list = $(".restaurant-list");
    if (list) {
      const item = RestaurantItem({ restaurant });
      list.appendChild(item);
    }
  },
  removeItem(restaurantName) {
    const target = $(`.restaurant[data-id="${restaurantName}"]`);
    target == null ? void 0 : target.remove();
  }
};
class ModalController {
  constructor() {
    __privateAdd(this, _ModalController_instances);
    __publicField(this, "modal");
    __publicField(this, "content");
    __publicField(this, "open");
    __publicField(this, "close");
    const { modal, open, close } = Modal({});
    this.modal = modal;
    this.open = open;
    this.close = close;
  }
  renderModal() {
    const main = $("main");
    main == null ? void 0 : main.appendChild(this.modal);
  }
  openRestaurantAddModal(addRestaurantItem) {
    const restaurantAddModalContent = RestaurantAddModalContent();
    __privateMethod(this, _ModalController_instances, renderModalContent_fn).call(this, restaurantAddModalContent);
    __privateMethod(this, _ModalController_instances, attachCancelEvent_fn).call(this);
    __privateMethod(this, _ModalController_instances, attachFormSubmitEvent_fn).call(this, addRestaurantItem);
    this.open();
  }
  openRestaurantDetailModal(restaurant, restaurantsModel) {
    const restaurantDetailModalContent = RestaurantDetailModalContent({ restaurant });
    __privateMethod(this, _ModalController_instances, renderModalContent_fn).call(this, restaurantDetailModalContent);
    __privateMethod(this, _ModalController_instances, attachDetailModalEvents_fn).call(this, restaurant, restaurantsModel);
    this.open();
  }
}
_ModalController_instances = new WeakSet();
renderModalContent_fn = function(content) {
  this.content = content;
  const modalContainer = $(".modal-container");
  if (modalContainer) {
    modalContainer == null ? void 0 : modalContainer.replaceWith(content);
  } else {
    this.modal.appendChild(content);
  }
};
attachCancelEvent_fn = function() {
  const closeButton = $("#restaurantAddModalCancelButton");
  closeButton == null ? void 0 : closeButton.addEventListener("click", this.close);
};
attachFormSubmitEvent_fn = function(addRestaurantItem) {
  const form = $("form");
  form == null ? void 0 : form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formElement = form;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());
    addRestaurantItem(data);
    formElement.reset();
    this.close();
  });
};
attachDetailModalEvents_fn = function(restaurant, restaurantsModel) {
  var _a;
  (_a = this.content) == null ? void 0 : _a.addEventListener("click", (event) => {
    const target = event.target;
    const favoriteButton = target.closest(".restaurant__favorite-button");
    const deleteButton = target.closest(".button--secondary");
    const closeButton = target.closest(".button--primary");
    if (favoriteButton) {
      restaurantsModel.toggleFavoriteRestaurant(restaurant.name);
      favoriteButton.replaceWith(FavoriteButton({ isFavorite: restaurant.isFavorite, isDetail: true }));
      const listRestaurantElement = $(`.restaurant[data-id="${restaurant.name}"]`);
      if (listRestaurantElement) {
        const listFavoriteButton = $(".restaurant__favorite-button", listRestaurantElement);
        listFavoriteButton == null ? void 0 : listFavoriteButton.replaceWith(FavoriteButton({ isFavorite: restaurant.isFavorite }));
      }
    }
    if (closeButton) {
      this.close();
    }
    if (deleteButton) {
      restaurantsModel.removeRestaurant(restaurant.name);
      this.close();
      RestaurantListView.removeItem(restaurant.name);
    }
  });
};
class RestaurantListController {
  constructor(restaurants, onToggleFavorite, onSelectRestaurant) {
    __privateAdd(this, _RestaurantListController_instances);
    __privateAdd(this, _restaurants2);
    __privateAdd(this, _onToggleFavorite);
    __privateAdd(this, _onSelectRestaurant);
    __privateSet(this, _restaurants2, restaurants);
    __privateSet(this, _onToggleFavorite, onToggleFavorite);
    __privateSet(this, _onSelectRestaurant, onSelectRestaurant);
  }
  render() {
    RestaurantListView.render(__privateGet(this, _restaurants2));
    __privateMethod(this, _RestaurantListController_instances, bindEvents_fn2).call(this);
  }
  updateList(restaurants) {
    RestaurantListView.updateList(restaurants);
  }
  addItem(restaurant) {
    RestaurantListView.addItem(restaurant);
  }
}
_restaurants2 = new WeakMap();
_onToggleFavorite = new WeakMap();
_onSelectRestaurant = new WeakMap();
_RestaurantListController_instances = new WeakSet();
bindEvents_fn2 = function() {
  const container = $(".restaurant-list-container");
  container == null ? void 0 : container.addEventListener("click", (event) => {
    const target = event.target;
    const restaurantElement = target.closest(".restaurant");
    const restaurantFavoriteButton = target.closest(".restaurant__favorite-button");
    if (!restaurantElement) return;
    const restaurantName = restaurantElement.dataset.id;
    const selectedRestaurant = __privateGet(this, _restaurants2).find((restaurant) => restaurant.name === restaurantName);
    if (selectedRestaurant) {
      if (restaurantFavoriteButton) {
        __privateGet(this, _onToggleFavorite).call(this, selectedRestaurant.name);
        restaurantFavoriteButton.replaceWith(FavoriteButton({ isFavorite: selectedRestaurant.isFavorite }));
      } else {
        __privateGet(this, _onSelectRestaurant).call(this, selectedRestaurant);
      }
    }
  });
};
function RestaurantTabContainer(tabType) {
  return createDOMElement({
    tag: "section",
    class: "restaurant-tab-container",
    "data-active": tabType,
    children: [
      createDOMElement({
        tag: "div",
        class: "restaurant-tab active",
        "data-tab": "all",
        textContent: "모든 음식점"
      }),
      createDOMElement({
        tag: "div",
        class: "restaurant-tab",
        "data-tab": "favorite",
        textContent: "자주 가는 음식점"
      }),
      createDOMElement({
        tag: "div",
        class: "restaurant-tab-underline"
      })
    ]
  });
}
class TabController {
  constructor(onTabChange) {
    __privateAdd(this, _TabController_instances);
    __privateAdd(this, _container);
    __privateAdd(this, _currentTab);
    __privateAdd(this, _onTabChange);
    __privateSet(this, _container, null);
    __privateSet(this, _currentTab, "all");
    __privateSet(this, _onTabChange, onTabChange);
  }
  render() {
    const main = $("main");
    const tabContainer = RestaurantTabContainer(__privateGet(this, _currentTab));
    main == null ? void 0 : main.prepend(tabContainer);
    __privateSet(this, _container, tabContainer);
    __privateMethod(this, _TabController_instances, bindEvents_fn3).call(this);
  }
}
_container = new WeakMap();
_currentTab = new WeakMap();
_onTabChange = new WeakMap();
_TabController_instances = new WeakSet();
bindEvents_fn3 = function() {
  if (!__privateGet(this, _container)) return;
  const tabs = $all(".restaurant-tab", __privateGet(this, _container));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      var _a;
      const tabType = tab.dataset.tab || "all";
      if (__privateGet(this, _currentTab) === tabType) {
        return;
      }
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      (_a = __privateGet(this, _container)) == null ? void 0 : _a.setAttribute("data-active", tabType);
      __privateSet(this, _currentTab, tabType);
      __privateGet(this, _onTabChange).call(this, tabType);
    });
  });
};
class AppController {
  constructor() {
    __privateAdd(this, _AppController_instances);
    __publicField(this, "modalController");
    __publicField(this, "restaurants");
    __publicField(this, "tabController");
    __publicField(this, "filterController");
    __publicField(this, "restaurantListController");
    this.tabController = new TabController((tabType) => {
      __privateMethod(this, _AppController_instances, onTabChange_fn).call(this, tabType);
    });
    this.filterController = new FilterController((type, value) => {
      __privateMethod(this, _AppController_instances, onFilterChange_fn).call(this, type, value);
    });
    this.modalController = new ModalController();
    this.restaurants = new Restaurants();
    this.restaurantListController = new RestaurantListController(
      this.restaurants.items,
      (restaurantName) => {
        this.restaurants.toggleFavoriteRestaurant(restaurantName);
      },
      (restaurant) => {
        this.modalController.openRestaurantDetailModal(restaurant, this.restaurants);
      }
    );
  }
  init() {
    this.renderHeader();
    this.tabController.render();
    this.filterController.render();
    this.restaurantListController.render();
    this.modalController.renderModal();
  }
  renderHeader() {
    const body = $("body");
    const header = Header({
      title: "점심 뭐 먹지",
      right: PlusButton({
        onclick: () => this.modalController.openRestaurantAddModal((data) => __privateMethod(this, _AppController_instances, addRestaurantItem_fn).call(this, data))
      })
    });
    body == null ? void 0 : body.prepend(header);
  }
}
_AppController_instances = new WeakSet();
onTabChange_fn = function(tabType) {
  if (tabType === "all") {
    this.filterController.render();
    this.restaurantListController.updateList(this.restaurants.items);
  } else if (tabType === "favorite") {
    this.filterController.remove();
    const favoriteRestaurants = this.restaurants.getFavoriteRestaurants();
    this.restaurantListController.updateList(favoriteRestaurants);
  }
};
onFilterChange_fn = function(type, value) {
  const filteredRestaurants = this.restaurants.getRestaurantByFilter(type, value);
  this.restaurantListController.updateList(filteredRestaurants);
};
addRestaurantItem_fn = function(restaurant) {
  this.restaurants.addRestaurant({ ...restaurant, isFavorite: false });
  this.restaurantListController.addItem(restaurant);
};
const app = new AppController();
app.init();
