import Intail from "./intial";
import { Routes, Route, useNavigate } from "react-router";
import HomeProxy from "./pages/home/HomeProxy";
import ShowNote from "./pages/ShowNote/ShowNote";
import SecureRoute from "./secureRoute";
import Auth from "./pages/auth/auth";
import NewOrEdit from "./pages/NewOrEdit/modify";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intail />} />
      <Route element={<SecureRoute />}>
        <Route path="/home" element={<HomeProxy />} />
        <Route path="/new" element={<NewOrEdit isEdit={false} />} />
        <Route path="/note/:id">
          <Route index element={<ShowNote />} />
          <Route path="edit" element={<NewOrEdit isEdit={true} />} />
        </Route>
      </Route>
      <Route path="*" element={<Auth />} />
    </Routes>
  );
}

export default App;
