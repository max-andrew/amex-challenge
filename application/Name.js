"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const cachingFetch_1 = require("../caching-fetch-library/cachingFetch");
const validation_1 = require("./validation");
const Name = ({ index }) => {
  // We are intentionally passing down the index prop to the Name component
  // To simulate the useCachingFetch hook being used in different locations
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
  const person = data[index];
  return (0, jsx_runtime_1.jsx)("div", {
    children: (0, jsx_runtime_1.jsxs)("h2", {
      children: [person.first, " ", person.last],
    }),
  });
};
exports.default = Name;
//# sourceMappingURL=Name.js.map
