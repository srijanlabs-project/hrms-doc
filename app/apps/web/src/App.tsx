import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { MyStaffsyPage } from "./pages/MyStaffsyPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<MyStaffsyPage />} />
      </Route>
    </Routes>
  );
}
