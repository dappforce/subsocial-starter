import React, { useContext } from "react";
import { SubsocialContext } from "./subsocial/provider";

const App = () => {

  const { isReady, api } = useContext(SubsocialContext)

  console.log(`Is API ready: ${isReady}`)

  return <div>My CRA template</div>;
};

export default App;