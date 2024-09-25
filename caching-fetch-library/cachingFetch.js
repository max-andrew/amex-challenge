"use strict";
// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wipeCache =
  exports.initializeCache =
  exports.serializeCache =
  exports.preloadCachingFetch =
  exports.useCachingFetch =
    void 0;
const react_1 = require("react");
let cache = {};
/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
const useCachingFetch = (url) => {
  const [data, setData] = (0, react_1.useState)(null);
  const [isLoading, setIsLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  (0, react_1.useEffect)(() => {
    if (cache[url]) {
      // Use existing cached data if available
      setData(cache[url]);
      return;
    }
    const fetchData = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        // Reset the error
        setError(null);
        try {
          const response = yield fetch(url);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result = yield response.json();
          // Store res in cache
          cache[url] = result;
          setData(result);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      });
    fetchData();
  }, [url]);
  return {
    isLoading,
    data,
    error,
  };
};
exports.useCachingFetch = useCachingFetch;
/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
const preloadCachingFetch = (url) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Skip if the data already exists in cache
    if (cache[url]) {
      return;
    }
    try {
      const response = yield fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = yield response.json();
      // Store in cache if request is successful
      cache[url] = result;
    } catch (error) {
      console.error(`Preload failed on URL: ${url}`, error);
      throw error;
    }
  });
exports.preloadCachingFetch = preloadCachingFetch;
/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
const serializeCache = () => {
  return JSON.stringify(cache);
};
exports.serializeCache = serializeCache;
const initializeCache = (serializedCache) => {
  try {
    cache = JSON.parse(serializedCache);
  } catch (error) {
    console.error("Error initializing cache", error);
  }
};
exports.initializeCache = initializeCache;
const wipeCache = () => {
  cache = {};
};
exports.wipeCache = wipeCache;
//# sourceMappingURL=cachingFetch.js.map
