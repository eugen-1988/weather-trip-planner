import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppWrapper from "./components/AppWrapper";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./utils/fixLeafletIcons";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
