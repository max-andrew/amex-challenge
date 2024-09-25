# People Directory Library


## Starting the project

Initialize the project by running `npm i`
Start the project using `npm start`
Navigate to `localhost:3000` to view the project in development

## Purpose

The People Directory returns a list of users with personal information about each user.

This information uses the following interface:
```
{
  first: string,
  last: string,
  email: string,
  address: string,
  created: string,
  balance: string
}
```

This information is extremely sensitive. The library takes this into account across a number of architectural decisions and in planning for future development throughout the roadmap. For efficiency, this application caches the result of this "People Directory" both locally on the client as well as on the server.


## Fetching

This library makes use of caching to ensure performance in terms of response speed and network efficiency. The logic for this is contained in `caching-fetch-library/cachingFetch.ts`. There are two places this caching occurs: client- and server-side.

The client is able to store a local cache using the `useCachingFetch` hook. This process can be made even more efficient and eliminate the need for redundant calls entirely by making use of preload calls performed by the server with the `preloadCachingFetch` function, together with the transfer functions. 

The current approach stores the cache in-memory. This was selected for a number of reasons.

1. The People Directory contains sensitive information like names, emails, addresses, and balances. Data security and privacy must be a top concern. Using `localStorage` and plaintext would expose these details and keep them available in any number of browsers. This is not an acceptable solution without further consideration around encryption, what machines will have access to this information, and how these caches can be purged. Alternatives like `sessionStorage` could make sense, however, and the possibility is discussed in this document.

2. Cookies would not be a good choice either. They are limited in size to about 4KB which could quickly become limiting as the dataset grows. They are also sent with each HTTP request, which would be inefficient network use and could create a vulnerability by potentially exposing this sensitive data both in transit and at rest.

3. Leveraging closures, the logic is extremely readable and maintainable. The same line declaring the cache can be used for both the client- and server-side, which would not be possible with a solution like `sessionStorage`.

4. As the application currently stands, the directory of user information seems likely to only be needed on a single page (ignoring the demonstrative use of the separation between `/appWithoutSSRData` and `/appWithSSRData`). This means `sessionStorage` is not as necessary as it would be in an application where the cached data is used across a number of pages.

5. Storing the data in memory helps obviate the potential for memory bloat by purging the cache when the page is reloaded or navigated away from. Similarly, it partly addresses the possibility of stale data by reloading the API result when either of these actions take place.

6. In-memory storage is generally faster than using `sessionStorage`, particularly as the cache grows large.

Still, there are advantages to using a solution like `sessionStorage` for the client and the implementation of it is planned and outlined in the roadmap section, taking into account the number of considerations around its tradeoffs.


## Project configuration

### Code quality

#### Linting

ESLint was added to catch common errors around issues like unreachable code, undefined variables, and to enforce consistent coding guidelines. 

`npm run lint`
`npm run lint:fix`

#### Formatting

Prettier was added to make sure the code style remains consistent. This fixes more cosmetic issues like indentation and spacing.

`npm run format`

#### Testing

Jest was added to efficiently add unit and integration tests.

`npm run test`

### TS configuration

The `tsconfig.json` file was simplified to remove helper comments related to different properties. Warnings related to unused imports of React and unused variables in Fastify routes will be addressed incrementally during a migration to React 17+ and are unrelated to the core caching library. These warnings can be fixed by removing the React import for JSX and by adding an underscore to the request variable for Fastify calls.


## Potential issues

#### Data privacy

The People Directory contains sensitive personal information. As such, we must take the highest care to analyze potential vulnerabilities and minimize the risk of data mishandling and misuse. This problem can be broken into two categories: data at rest, and data in transit.

##### At rest

The cached data is available in plaintext both on the server cache as well as the browser cache. This is not as secure as it should be. The client must eventually be able to read this information in plaintext so there are limitations on the amount of encryption that can be used. Still though, it is important to take architecture into account and other considerations like the browser being a secure, trusted machine. On the server-side, the cache can in fact be made more secure using encryption. AES could be used in tandem with secure key management to make sure the data is encrypted before being cached and decrypted when sent to the client.

##### In transit

The POST HTTP method is generally considered safer for receiving sensitive information over the GET method. The `fetch` functions in `cachingFetch.ts` currently use the default method, GET. Given that this is performed using the JavaScript `fetch` API, the data is not appended to the URL, and therefore not stored in the browser history. Furthermore, the distinction is less significant provided that HTTPS is used. Both methods will send the data in an encrypted manner over transit. Still, this means that utilizing HTTPS over HTTP is particularly critical. Security headers should also be put in place to prevent XSS attacks.

#### Memory management

As alluded to in the roadmap section, memory management around the cache could become an issue as it is currently implemented. This is because the cache grows with each different API request. If the application begins to pull from a number of APIs, there could become a problem with bloated memory given there is no mechanism for limiting or clearing it.

#### Scaling

##### Horizontally (across servers)

In situations where the backend service is expanded across a number of servers, the caching would only be performed and available for each individual one. This means they would not share the same cache and would all have different, and likely redundant, caches.

##### Vertically (same server)

In instances where the amount of data in the directory grows very large, adding more RAM and processing power could be required. This, however, is expensive. A large network request would also block any loading until the entire request is completed. Solutions like batching could be required to address this.

#### Stale data

The caching system does not currently include a system for purging or updating the cache. This makes it susceptible to storing stale data and could cause problems if data is changed or new data is added. A hash of the data could be used to check for any changes to the data in a secure and efficient way.

#### Syncing issues

Problems with serialization and initialization could create inconsistencies between the server cache and the client cache.

#### API limitations

There is not much insight into the backend that stores this data and responds to (initial) fetch requests. Potential concerns include the possibilities of rate-limiting and outages. A process should be put in place to address these with retry strategies and fallback data.


## Future roadmap

### Data privacy

A number of potential issues around data privacy exist as the project is currently configured. Addressing these with tools like encryption and careful threat analysis is a top priority moving forward given the sensitivity of the personal information being queried, stored, and displayed.

### Implementing the Next.js framework

Next would provide a number of benefits to make this application more production-ready. First, it would eliminate the need for manually serializing requests. Next does this automatically and the data could be passed directly to the client using functions like `getServerSideProps` or `getStaticProps`. Next could improve performance in some areas with solutions like automatic code splitting. If images are served, it would optimize the performance for them as well. If this application ever needs SEO optimization, the SSR and SSG options would boost rankings. Next would also open some other possibilities like using API routes that would make colocation simpler by placing the API logic together and potentially removing the need for a separate backend server.

### Cache management

#### sessionStorage

The code will be updated to use `sessionStorage` on the client-side so that the cache persists as long as the tab remains open, even in the page is navigated away from or refreshed. This strikes a balance between reducing the number of redundant server calls and data privacy. Still, the serious considerations around data privacy mandate that it is implemented carefully.

#### Centralized caching server

If the backend is scaled to run on a number of different servers, each one will be required to create and manage their own cache, likely leading to a number of redundant networks calls and caches. The server-side could use one central server for the cache or implement a solution like Redis to maintain a persistent cache.

### Memory management

A mechanism will be built to periodically purge entries from the cache that have gone unused for some period of time and to set a limit on the size of the cache. Particularly on the client-side, this will ensure the cache does not consume an exceeding amount of memory.

### Separation of concerns

The `cachingFetch.ts` file includes both a client hook as well as a server preload function. The purpose of this logic could be more clearly conveyed by breaking it out into different files organized across the repository. This could use the following structure:

/src
  /client
    useCachingFetch.ts
  /server
    preloadCachingFetch.ts
  /utils
    cacheUtils.ts

### TS compiler configuration

The library should also compile all TypeScript into a central /dist folder to make sure the core source code does not include duplicated JavaScript output files.

### Batching request

If the size of the directory grows very large, the fetch calls could become excessively slow in receiving any data at all. Instead, a batching approach could be taken to incrementally load various bits of the data. Even more, the client could intelligently load only the amount of data that fits the given page, and make additional requests for more data in the background as the user scrolls or requires more data.

### Retries and fallbacks

Initial fetch requests could fail for reasons like API rate-limiting. This is particularly likely if there is an issue with the `preloadCachingFetch` call and each client needs to query and cache the source API data. Similarly, there could be issues with the source server having an outage. Backups should be implemented to ensure the data remains available and that there are retry mechanisms in place to automatically reattempt queries if one should fail.

### Data types

The response data currently returns all data as a string. This could be improved in two ways. First, the `created` value could be stored as a `Date` type. It would also be beneficial to include a method of clarifying the timezone. This could be accomplished by storing dates in UTC, then converting to the client's local time on the frontend. Similarly, the `balance` value could be stored as a `number` with the currency symbol added on the frontend after converting it to a string. This could make calculations simpler as long as the currency type is still made clear to developers.

### Testing

Jest was added to the project. This will be useful for both unit and integration testing, to check the fetching logic and make sure the caching process is working correctly, but no tests have been written yet. With it, mock API requests can be made, and the cache and error handling can be checked. These tests can be run automatically within a GitHub workflow as part of continuous integration testing.

### CI/CD

GitHub Actions will be included to ensure that automated testing and deployment are made possible after each update is pushed to the repository. The CI side could include the added linter and formatter as well as the testing. The CD side would involve pushing the code to the existing server infrastructure.
