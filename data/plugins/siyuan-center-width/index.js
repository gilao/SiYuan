"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const siyuan = require("siyuan");
const widthStyle = ':root {\n    --centerWidth: 70%;\n    /* --lrwidth: calc((100% - var(--centerWidth)) / 2); */\n    --lrwidth: max(calc((100% - var(--centerWidth)) / 2), 15px);\n    --refcountRight: -16px;\n}\n\n/* .layout__center 只对中央编辑器生效, 不对 dock 栏目和 floating window 的 protyle 生效 */\n#layouts div.layout__center div.protyle-content:not([data-fullwidth="true"]) div.protyle-title {\n    margin-left: var(--lrwidth) !important;\n    margin-right: var(--lrwidth) !important;\n}\n\n#layouts div.layout__center div.protyle-content:not([data-fullwidth="true"]) div.protyle-wysiwyg {\n    padding-left: var(--lrwidth) !important;\n    padding-right: var(--lrwidth) !important;\n}\n\n#layouts div.layout__center div.protyle-content:not([data-fullwidth="true"]) div.protyle-background>div.protyle-background__ia {\n    margin-left: var(--lrwidth) !important;\n}\n\n#layouts div.layout__center div.protyle-content div.protyle-attr--refcount {\n    right: var(--refcountRight) !important;\n}\n\n/* 对 Mini Window 做特别处理*/\nbody.body--window #layouts div.protyle-content:not([data-fullwidth="true"]) div.protyle-title {\n    margin-left: var(--lrwidth) !important;\n    margin-right: var(--lrwidth) !important;\n}\n\nbody.body--window #layouts div.protyle-content:not([data-fullwidth="true"]) div.protyle-wysiwyg {\n    padding-left: var(--lrwidth) !important;\n    padding-right: var(--lrwidth) !important;\n}\n\nbody.body--window #layouts div.protyle-content:not([data-fullwidth="true"]) div.protyle-background>div.protyle-background__ia {\n    margin-left: var(--lrwidth) !important;\n}\n\n/* 预览模式 */\ndiv.protyle-preview>div.b3-typography {\n    padding-left: var(--lrwidth) !important;\n    padding-right: var(--lrwidth) !important;\n}\n\n\n';
const valueOf = (ele) => {
  let val = null;
  if (ele instanceof HTMLInputElement) {
    if (ele.type === "checkbox") {
      val = ele.checked;
    } else {
      if (ele.type === "number") {
        val = parseInt(ele.value);
      } else {
        val = ele.value;
      }
    }
  } else if (ele instanceof HTMLSelectElement) {
    val = ele.value;
  } else if (ele instanceof HTMLTextAreaElement) {
    val = ele.value;
  } else {
    val = ele == null ? void 0 : ele.textContent;
  }
  return val;
};
const setValue = (ele, value) => {
  if (ele === null || ele === void 0)
    return;
  if (ele instanceof HTMLInputElement) {
    if (ele.type === "checkbox") {
      ele.checked = value;
    } else {
      ele.value = value;
    }
    if (ele.type === "range") {
      ele.ariaLabel = value;
    }
  } else if (ele instanceof HTMLSelectElement) {
    ele.value = value;
  } else if (ele instanceof HTMLTextAreaElement) {
    ele.value = value;
  } else {
    ele.textContent = value;
  }
};
class SettingUtils {
  constructor(args) {
    __publicField(this, "plugin");
    __publicField(this, "name");
    __publicField(this, "file");
    __publicField(this, "settings", /* @__PURE__ */ new Map());
    __publicField(this, "elements", /* @__PURE__ */ new Map());
    this.name = args.name ?? "settings";
    this.plugin = args.plugin;
    this.file = this.name.endsWith(".json") ? this.name : `${this.name}.json`;
    this.plugin.setting = new siyuan.Setting({
      width: args.width,
      height: args.height,
      confirmCallback: () => {
        for (let key of this.settings.keys()) {
          this.updateValueFromElement(key);
        }
        let data = this.dump();
        if (args.callback !== void 0) {
          args.callback(data);
        }
        this.plugin.data[this.name] = data;
        this.save();
      },
      destroyCallback: () => {
        for (let key of this.settings.keys()) {
          this.updateElementFromValue(key);
        }
      }
    });
  }
  async load() {
    let data = await this.plugin.loadData(this.file);
    console.debug("Load config:", data);
    if (data) {
      for (let [key, item] of this.settings) {
        item.value = (data == null ? void 0 : data[key]) ?? item.value;
      }
    }
    this.plugin.data[this.name] = this.dump();
    return data;
  }
  async save() {
    let data = this.dump();
    await this.plugin.saveData(this.file, this.dump());
    console.debug("Save config:", data);
    return data;
  }
  /**
   * read the data after saving
   * @param key key name
   * @returns setting item value
   */
  get(key) {
    var _a;
    return (_a = this.settings.get(key)) == null ? void 0 : _a.value;
  }
  /**
   * Set data to this.settings, 
   * but do not save it to the configuration file
   * @param key key name
   * @param value value
   */
  set(key, value) {
    let item = this.settings.get(key);
    if (item) {
      item.value = value;
      this.updateElementFromValue(key);
    }
  }
  /**
   * Disable setting item
   * @param key key name
   */
  disable(key) {
    let element = this.elements.get(key);
    if (element) {
      element.disabled = true;
    }
  }
  /**
   * Enable setting item
   * @param key key name
   */
  enable(key) {
    let element = this.elements.get(key);
    if (element) {
      element.disabled = false;
    }
  }
  /**
   * 将设置项目导出为 JSON 对象
   * @returns object
   */
  dump() {
    let data = {};
    for (let [key, item] of this.settings) {
      if (item.type === "button")
        continue;
      data[key] = item.value;
    }
    return data;
  }
  addItem(item) {
    this.settings.set(item.key, item);
    if (item.createElement === void 0) {
      let itemElement = this.createDefaultElement(item);
      this.elements.set(item.key, itemElement);
      this.plugin.setting.addItem({
        title: item.title,
        description: item == null ? void 0 : item.description,
        createActionElement: () => {
          this.updateElementFromValue(item.key);
          let element = this.getElement(item.key);
          return element;
        }
      });
    } else {
      this.plugin.setting.addItem({
        title: item.title,
        description: item == null ? void 0 : item.description,
        createActionElement: () => {
          let val = this.get(item.key);
          let element = item.createElement(val);
          this.elements.set(item.key, element);
          return element;
        }
      });
    }
  }
  createDefaultElement(item) {
    var _a, _b, _c, _d, _e;
    let itemElement;
    switch (item.type) {
      case "checkbox":
        let element = document.createElement("input");
        element.type = "checkbox";
        element.checked = item.value;
        element.className = "b3-switch fn__flex-center";
        itemElement = element;
        break;
      case "select":
        let selectElement = document.createElement("select");
        selectElement.className = "b3-select fn__flex-center fn__size200";
        let options = (item == null ? void 0 : item.options) ?? {};
        for (let val in options) {
          let optionElement = document.createElement("option");
          let text = options[val];
          optionElement.value = val;
          optionElement.text = text;
          selectElement.appendChild(optionElement);
        }
        selectElement.value = item.value;
        itemElement = selectElement;
        break;
      case "slider":
        let sliderElement = document.createElement("input");
        sliderElement.type = "range";
        sliderElement.className = "b3-slider fn__size200 b3-tooltips b3-tooltips__n";
        sliderElement.ariaLabel = item.value;
        sliderElement.min = ((_a = item.slider) == null ? void 0 : _a.min.toString()) ?? "0";
        sliderElement.max = ((_b = item.slider) == null ? void 0 : _b.max.toString()) ?? "100";
        sliderElement.step = ((_c = item.slider) == null ? void 0 : _c.step.toString()) ?? "1";
        sliderElement.value = item.value;
        sliderElement.onchange = () => {
          sliderElement.ariaLabel = sliderElement.value;
        };
        itemElement = sliderElement;
        break;
      case "textinput":
        let textInputElement = document.createElement("input");
        textInputElement.className = "b3-text-field fn__flex-center fn__size200";
        textInputElement.value = item.value;
        itemElement = textInputElement;
        break;
      case "number":
        let numberElement = document.createElement("input");
        numberElement.type = "number";
        numberElement.className = "b3-text-field fn__flex-center fn__size200";
        numberElement.value = item.value;
        itemElement = numberElement;
        break;
      case "textarea":
        let textareaElement = document.createElement("textarea");
        textareaElement.className = "b3-text-field fn__block";
        textareaElement.value = item.value;
        itemElement = textareaElement;
        break;
      case "button":
        let buttonElement = document.createElement("button");
        buttonElement.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        buttonElement.innerText = ((_d = item.button) == null ? void 0 : _d.label) ?? "Button";
        buttonElement.onclick = ((_e = item.button) == null ? void 0 : _e.callback) ?? (() => {
        });
        itemElement = buttonElement;
        break;
    }
    return itemElement;
  }
  /**
   * return the setting element
   * @param key key name
   * @returns element
   */
  getElement(key) {
    let element = this.elements.get(key);
    return element;
  }
  updateValueFromElement(key) {
    let item = this.settings.get(key);
    let element = this.elements.get(key);
    item.value = valueOf(element);
  }
  updateElementFromValue(key) {
    let item = this.settings.get(key);
    let element = this.elements.get(key);
    setValue(element, item.value);
  }
}
function insertStyle(id, style) {
  let styleEle = document.createElement("style");
  styleEle.id = id;
  styleEle.innerHTML = style;
  document.head.appendChild(styleEle);
}
function removeStyle(id) {
  let styleEle = document.getElementById(id);
  if (styleEle) {
    styleEle.remove();
  }
}
class PercentileWidthDialog extends siyuan.Dialog {
  constructor(plugin) {
    const width = plugin.settingUtils.get("width");
    let dom = `
        <div id="plugin-width__setting">
            <div style="padding-bottom: 1rem">
                40%
                <input
                    class="b3-slider fn__size200 b3-tooltips b3-tooltips__s"
                    max="100" min="40" step="1" type="range" value="${width}"
                    aria-label="${width}%" id=""
                />
                100%
            </div>
        </div>
        `;
    super({
      title: `${plugin.i18n.title}: ${width}%`,
      content: dom,
      destroyCallback: () => {
        plugin.settingUtils.save();
        plugin.updateAllPadding();
      }
    });
    __publicField(this, "value");
    let header = this.element.querySelector(".b3-dialog__header");
    let body = this.element.querySelector(".b3-dialog__body");
    body.style.padding = "1rem";
    header.style.textAlign = "center";
    const inputCenterWidth = this.element.querySelector("input.b3-slider");
    inputCenterWidth.addEventListener("input", (e) => {
      const width2 = parseInt(e.target.value);
      plugin.settingUtils.set("width", width2);
      header.innerText = `${plugin.i18n.title}: ${width2}%`;
      inputCenterWidth.setAttribute("aria-label", `${width2}%`);
      plugin.updateStyleVar(width2);
    });
  }
}
class PixelWidthDialog extends siyuan.Dialog {
  constructor(plugin) {
    const width = plugin.settingUtils.get("width");
    let dom = `
        <div id="plugin-width__setting">
            <div style="padding-bottom: 1rem">
                <input
                    class="b3-text-field fn__flex-center fn__size200"
                    type="number" value="${width}"
                />
                px
            </div>
        </div>
        `;
    super({
      title: `${plugin.i18n.title}: ${width}px`,
      content: dom,
      destroyCallback: () => {
        plugin.settingUtils.save();
        plugin.updateAllPadding();
      }
    });
    __publicField(this, "value");
    let header = this.element.querySelector(".b3-dialog__header");
    let body = this.element.querySelector(".b3-dialog__body");
    body.style.padding = "1rem";
    header.style.textAlign = "center";
    const inputCenterWidth = this.element.querySelector("input.b3-text-field");
    inputCenterWidth.addEventListener("change", (e) => {
      const width2 = parseInt(e.target.value);
      plugin.settingUtils.set("width", width2);
      header.innerText = `${plugin.i18n.title}: ${width2}px`;
      plugin.updateStyleVar(width2);
    });
  }
}
const createDialog = (plugin) => {
  let mode = plugin.settingUtils.get("widthMode");
  if (mode === "%") {
    return new PercentileWidthDialog(plugin);
  } else if (mode === "px") {
    return new PixelWidthDialog(plugin);
  }
};
function throttle(func, wait = 500) {
  let previous = 0;
  return function() {
    let now = Date.now(), context = this, args = [...arguments];
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
const InMiniWindow = () => {
  const body = document.querySelector("body");
  return body.classList.contains("body--window");
};
const DefaultIncrement = {
  "%": 1,
  "px": 25
};
const Zoomer = (plugin, key = "width", incrementMap = DefaultIncrement, type) => {
  if (!incrementMap) {
    incrementMap = DefaultIncrement;
  } else {
    incrementMap = Object.assign(DefaultIncrement, incrementMap);
  }
  const plusPercent = () => {
    let width = plugin.settingUtils.get(key);
    const increment = incrementMap["%"];
    if (width + increment <= 100) {
      width += increment;
      plugin.settingUtils.set(key, width);
      plugin.updateStyleVar(width, "%");
    }
  };
  const minusPercent = () => {
    let width = plugin.settingUtils.get(key);
    const increment = incrementMap["%"];
    if (width - increment >= 40) {
      width -= increment;
      plugin.settingUtils.set(key, width);
      plugin.updateStyleVar(width, "%");
    }
  };
  const plusPx = () => {
    let width = plugin.settingUtils.get(key);
    const increment = incrementMap["px"];
    width += increment;
    plugin.settingUtils.set(key, width);
    plugin.updateStyleVar(width, "px");
  };
  const minusPx = () => {
    let width = plugin.settingUtils.get(key);
    const increment = incrementMap["px"];
    width -= increment;
    plugin.settingUtils.set(key, width);
    plugin.updateStyleVar(width, "px");
  };
  return {
    plus: () => {
      let curType = type;
      if (curType === void 0) {
        curType = plugin.settingUtils.get("widthMode");
      }
      if (curType === "%") {
        plusPercent();
      } else {
        plusPx();
      }
    },
    minus: () => {
      let curType = type;
      if (curType === void 0) {
        curType = plugin.settingUtils.get("widthMode");
      }
      if (curType === "%") {
        minusPercent();
      } else {
        minusPx();
      }
    }
  };
};
class WidthPlugin extends siyuan.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "beforeUnloadBindThis", this.beforeUnload.bind(this));
    __publicField(this, "iconEle");
    __publicField(this, "wysiwygMap", /* @__PURE__ */ new Map());
    __publicField(this, "observer");
    __publicField(this, "updateAllPaddingThrottled");
    __publicField(this, "onLoadProtyle");
    __publicField(this, "onDestroyProtyle");
    __publicField(this, "icon", `<svg t="1684328935774" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1746" width="32" height="32"><path d="M180 176h-60c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8z m724 0h-60c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8zM785.3 504.3L657.7 403.6c-4.7-3.7-11.7-0.4-11.7 5.7V476H378v-62.8c0-6-7-9.4-11.7-5.7L238.7 508.3c-3.7 2.9-3.7 8.5 0 11.3l127.5 100.8c4.7 3.7 11.7 0.4 11.7-5.7V548h268v62.8c0 6 7 9.4 11.7 5.7l127.5-100.8c3.8-2.9 3.8-8.5 0.2-11.4z" p-id="1747"></path></svg>`);
    __publicField(this, "isFullWidth");
    __publicField(this, "settingUtils");
  }
  // width: number;
  // enableMobile: boolean;
  async onload() {
    await this.initConfig();
    const enableMobile = this.settingUtils.get("enableMobile");
    const mode = this.settingUtils.get("mode");
    console.debug(enableMobile, siyuan.getFrontend());
    let forbidMobile = !enableMobile && siyuan.getFrontend() === "mobile";
    if (forbidMobile) {
      return;
    }
    insertStyle("plugin-width", widthStyle);
    const enableHotkey = this.settingUtils.get("enableHotkey");
    const AddHotkey = (zoomer) => {
      this.addCommand({
        langKey: "plugin-width.plus",
        langText: "Make editor wider",
        hotkey: "⌥=",
        callback: () => {
          zoomer.plus();
        }
      });
      this.addCommand({
        langKey: "plugin-width.minus",
        langText: "Make editor narrower",
        hotkey: "⌥-",
        callback: () => {
          zoomer.minus();
        }
      });
    };
    if (InMiniWindow()) {
      const width = this.settingUtils.get("miniWindowWidth");
      document.documentElement.style.setProperty("--centerWidth", `${width}%`);
      if (enableHotkey) {
        AddHotkey(Zoomer(this, "miniWindowWidth", { "%": 1 }, "%"));
      }
      return;
    }
    if (enableHotkey) {
      AddHotkey(Zoomer(this, "width", { "%": 2, "px": 25 }));
    }
    this.updateStyleVar();
    this.iconEle = this.addTopBar({
      icon: this.icon,
      title: this.i18n.title,
      position: "left",
      callback: () => {
        if (forbidMobile) {
          siyuan.showMessage(this.i18n.disableOnMobile, 2e3, "info");
          return;
        }
        let isFullwidth = this.checkFullWidth();
        if (isFullwidth === null && this.isFullWidth === void 0) {
          return;
        } else if (this.isFullWidth) {
          isFullwidth = this.isFullWidth;
        }
        this.isFullWidth = isFullwidth;
        if (isFullwidth) {
          siyuan.confirm(this.i18n.title, this.i18n.fullWidth);
          return;
        }
        createDialog(this);
      }
    });
    this.iconEle.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.openSetting();
    });
    if (mode === "simple") {
      return;
    }
    console.debug("Width Plugin: Bind JS Event");
    this.wysiwygMap = /* @__PURE__ */ new Map();
    this.updateAllPaddingThrottled = throttle(this.updateAllPadding.bind(this), 2e3);
    this.observer = new MutationObserver(() => {
      this.updateAllPaddingThrottled();
    });
    this.onLoadProtyle = (({ detail }) => {
      var _a, _b;
      console.debug("onLoadProtyle", detail);
      const protyle = detail == null ? void 0 : detail.protyle;
      let parent = protyle.element.parentElement;
      if (!parent.classList.contains("layout-tab-container")) {
        console.debug("Not a tab document");
        return;
      }
      const layout = (_b = (_a = parent == null ? void 0 : parent.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement;
      if (layout === void 0 || !layout.classList.contains("layout__center")) {
        console.debug("Not center layout");
        return;
      }
      let id = protyle == null ? void 0 : protyle.id;
      if (!id) {
        return;
      }
      console.debug(`Load Protyle with ID = ${id}`);
      if (this.wysiwygMap.has(id)) {
        return;
      }
      let wysiwyg = new WeakRef(protyle.wysiwyg.element);
      this.wysiwygMap.set(id, wysiwyg);
      console.debug("Current WysiwygMap", this.wysiwygMap);
      this.updateWysiwygPadding(wysiwyg);
      this.observer.observe(protyle.wysiwyg.element, {
        childList: false,
        attributes: true,
        characterData: false,
        subtree: false
      });
    }).bind(this);
    this.onDestroyProtyle = (({ detail }) => {
      var _a;
      console.debug("onDestroyProtyle", detail);
      let id = (_a = detail == null ? void 0 : detail.protyle) == null ? void 0 : _a.id;
      console.debug("Destroy Protyle ID = ", id);
      if (this.wysiwygMap.has(id)) {
        this.wysiwygMap.delete(id);
        console.debug("Current WysiwygMap", this.wysiwygMap);
      }
    }).bind(this);
    this.eventBus.on("loaded-protyle-static", this.onLoadProtyle);
    this.eventBus.on("destroy-protyle", this.onDestroyProtyle);
    window.addEventListener("beforeunload", this.beforeUnloadBindThis);
  }
  onLayoutReady() {
    console.groupCollapsed("Width Plugin: ListenInitialProtyles");
    let protyleList = document.querySelectorAll("#layouts div.layout-tab-container > div.protyle");
    for (let protyle of protyleList) {
      let dataId = protyle.getAttribute("data-id");
      if (!dataId) {
        continue;
      }
      if (this.wysiwygMap.has(dataId)) {
        console.log("Already has", dataId);
        continue;
      }
      let wysiwyg = protyle.querySelector("div.protyle-wysiwyg");
      let ref = new WeakRef(wysiwyg);
      this.wysiwygMap.set(dataId, ref);
      console.log("Add", dataId, ref);
    }
    this.updateAllPadding();
    console.groupEnd();
  }
  beforeUnload() {
    var _a, _b, _c;
    (_a = this.observer) == null ? void 0 : _a.disconnect();
    (_b = this.eventBus) == null ? void 0 : _b.off("loaded-protyle-static", this.onLoadProtyle);
    (_c = this.eventBus) == null ? void 0 : _c.off("destroy-protyle", this.onDestroyProtyle);
    this.wysiwygMap.clear();
  }
  updateAllPadding() {
    let faildKeys = [];
    for (let [key, value] of this.wysiwygMap) {
      let flag = this.updateWysiwygPadding(value);
      if (!flag) {
        faildKeys.push(key);
      }
    }
    for (let key of faildKeys) {
      this.wysiwygMap.delete(key);
    }
  }
  /**
   * 更新wysiwyg的内联 padding 样式，以便让 wysiwyg 当中的 iframe 的最大宽度可以和 protyle 的宽度一致
   */
  updateWysiwygPadding(wysiwyg) {
    var _a, _b, _c;
    let ele = wysiwyg == null ? void 0 : wysiwyg.deref();
    if (ele) {
      let parentElement = ele.parentElement;
      if (!parentElement) {
        return;
      }
      let fullWidth = parentElement.getAttribute("data-fullwidth");
      if (fullWidth === "true") {
        return;
      }
      let parentWidth = ele.parentElement.clientWidth;
      if (parentWidth === 0) {
        parentWidth = (_c = (_b = (_a = ele == null ? void 0 : ele.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.clientWidth;
        if (!parentWidth) {
          return;
        }
        parentWidth -= 10;
      }
      const mode = this.settingUtils.get("widthMode");
      const width = this.settingUtils.get("width");
      let padding;
      if (mode === "%") {
        padding = parentWidth * (1 - width / 100) / 2;
      } else if (mode === "px") {
        padding = (parentWidth - width) / 2;
      }
      ele.style.setProperty("padding-left", `${padding}px`);
      ele.style.setProperty("padding-right", `${padding}px`);
      if (padding < 16) {
        document.documentElement.style.setProperty("--refcountRight", `-${padding}px`);
      } else {
        document.documentElement.style.setProperty("--refcountRight", `-16px`);
      }
      return true;
    }
    return false;
  }
  updateStyleVar(width, mode) {
    mode = mode ?? this.settingUtils.get("widthMode");
    width = width ?? this.settingUtils.get("width");
    let widthStyle2 = mode === "%" ? `${width}%` : `${width}px`;
    document.documentElement.style.setProperty("--centerWidth", `${widthStyle2}`);
  }
  async initConfig() {
    const device = window.siyuan.config.system.id;
    this.settingUtils = new SettingUtils({
      plugin: this,
      name: `config-${device}`,
      callback: (data) => {
        let olddata = this.data[`config-${device}`];
        if (data.widthMode === "%" && olddata.widthMode === "px") {
          data.width = 70;
          this.settingUtils.set("width", data.width);
        } else if (data.widthMode === "px" && olddata.widthMode === "%") {
          data.width = 800;
          this.settingUtils.set("width", data.width);
        }
        this.updateStyleVar(data.width, data.widthMode);
      },
      width: "700px",
      height: "500px"
    });
    this.settingUtils.addItem({
      key: "widthMode",
      type: "select",
      value: "%",
      title: "编辑器宽度设置模式",
      description: "设置编辑器宽度的单位: 百分比或者 px",
      options: {
        "%": "百分比",
        "px": "像素"
      }
    });
    this.settingUtils.addItem({
      key: "width",
      value: 70,
      type: "slider",
      title: this.i18n.setting.width.title,
      description: this.i18n.setting.width.description,
      createElement: (value) => {
        let mode = this.settingUtils.get("widthMode");
        let ele;
        if (mode === "%") {
          ele = this.settingUtils.createDefaultElement({
            key: "",
            title: "",
            description: "",
            type: "slider",
            value: value <= 100 ? value : 70,
            //如果大于 100 则默认 70%
            slider: {
              min: 40,
              max: 100,
              step: 1
            }
          });
        } else {
          ele = this.settingUtils.createDefaultElement({
            key: "",
            title: "",
            description: "",
            type: "number",
            value: value >= 100 ? value : 800
            //如果小于 100 则默认 800px
          });
        }
        return ele;
      }
    });
    this.settingUtils.addItem({
      key: "miniWindowWidth",
      value: 94,
      type: "slider",
      title: this.i18n.setting.miniWindowWidth.title,
      description: this.i18n.setting.miniWindowWidth.description,
      slider: {
        min: 50,
        max: 100,
        step: 0.5
      }
    });
    this.settingUtils.addItem({
      key: "enableMobile",
      value: false,
      type: "checkbox",
      title: this.i18n.setting.enableMobile.title,
      description: this.i18n.setting.enableMobile.description
    });
    this.settingUtils.addItem({
      key: "enableHotkey",
      value: true,
      type: "checkbox",
      title: this.i18n.setting.enableHotkey.title,
      description: this.i18n.setting.enableHotkey.description
    });
    this.settingUtils.addItem({
      key: "mode",
      value: "simple",
      type: "select",
      title: this.i18n.setting.mode.title,
      description: this.i18n.setting.mode.description,
      options: {
        simple: this.i18n.setting.mode.simple,
        advanced: this.i18n.setting.mode.advanced
      }
    });
    await this.settingUtils.load();
  }
  checkFullWidth() {
    let content = document.querySelector("div.protyle-content");
    if (!content) {
      return null;
    }
    let attr = content.getAttribute("data-fullwidth");
    if (attr === "true") {
      this.isFullWidth = true;
      return true;
    } else {
      this.isFullWidth = false;
      return false;
    }
  }
  onunload() {
    var _a;
    removeStyle("plugin-width");
    this.wysiwygMap = null;
    this.eventBus.off("loaded-protyle-static", this.onLoadProtyle);
    (_a = this.eventBus) == null ? void 0 : _a.off("destroy-protyle", this.onDestroyProtyle);
    this.observer.disconnect();
    window.removeEventListener("beforeunload", this.beforeUnloadBindThis);
    this.settingUtils.save();
  }
}
module.exports = WidthPlugin;
