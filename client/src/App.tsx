import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import routes from "./routes";
import "./styles/index.css";
import "../node_modules/react-modal-video/css/modal-video.css";
import "rodal/lib/rodal.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
}

export default App;
