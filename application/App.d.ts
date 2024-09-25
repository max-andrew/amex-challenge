import { FC } from "react";
type Application = FC & {
  preLoadServerData?: () => Promise<void>;
};
declare const App: Application;
export default App;
