import React from 'react';
import './App.css';
import Login from "./components/organisms/Login/Login";
import PdfSigner from "./components/organisms/PdfSigner/PdfSigner";
import ListDocuments from "./components/organisms/ListDocuments/ListDocuments";

function App() {
  return (
    <div className="App">
        {/*<Login/>*/}
        {/*<PdfSigner token=""/>*/}
        <ListDocuments/>
    </div>
  );
}

export default App;
