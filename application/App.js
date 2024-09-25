"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const cachingFetch_1 = require("../caching-fetch-library/cachingFetch");
const Person_1 = __importDefault(require("./Person"));
const validation_1 = require("./validation");
const App = () => {
  const {
    data: rawData,
    isLoading,
    error,
  } = (0, cachingFetch_1.useCachingFetch)(
    "https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole&seed=123",
  );
  if (isLoading)
    return (0, jsx_runtime_1.jsx)("div", { children: "Loading..." });
  if (error || rawData === null)
    return (0, jsx_runtime_1.jsxs)("div", {
      children: [
        "Error: ",
        error === null || error === void 0 ? void 0 : error.message,
      ],
    });
  const data = (0, validation_1.validateData)(rawData);
  return (0, jsx_runtime_1.jsxs)("div", {
    children: [
      (0, jsx_runtime_1.jsx)("h1", {
        children: "Welcome to the People Directory",
      }),
      data.map((person, index) =>
        (0, jsx_runtime_1.jsx)(
          Person_1.default,
          { index: index },
          person.email,
        ),
      ),
    ],
  });
};
App.preLoadServerData = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, cachingFetch_1.preloadCachingFetch)(
      "https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole&seed=123",
    );
  });
exports.default = App;
//# sourceMappingURL=App.js.map
