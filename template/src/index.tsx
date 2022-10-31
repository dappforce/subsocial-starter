import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SubsocialContextProvider } from "./subsocial/provider";

ReactDOM.render(
  <React.StrictMode>
    <SubsocialContextProvider>
      <App />
    </SubsocialContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);