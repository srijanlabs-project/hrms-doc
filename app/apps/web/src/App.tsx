import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { EmployeeDirectoryPage } from "./features/employees/EmployeeDirectoryPage";
import { EmployeeProfilePage } from "./features/employees/EmployeeProfilePage";
import { MyStaffsyPage } from "./pages/MyStaffsyPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<MyStaffsyPage />} />
        <Route path="/people/employees" element={<EmployeeDirectoryPage />} />
        <Route path="/people/employees/:id" element={<EmployeeProfilePage />} />
      </Route>
    </Routes>
  );
}
