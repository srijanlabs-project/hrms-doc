import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { EmployeeDirectoryPage } from "./features/employees/EmployeeDirectoryPage";
import { EmployeeProfilePage } from "./features/employees/EmployeeProfilePage";
import { ApplyLeaveForm } from "./features/leave/ApplyLeaveForm";
import { ApprovalsPage } from "./features/leave/ApprovalsPage";
import { LeaveCalendarPage } from "./features/leave/LeaveCalendarPage";
import { LeaveHubPage } from "./features/leave/LeaveHubPage";
import { MyStaffsyPage } from "./pages/MyStaffsyPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<MyStaffsyPage />} />
          <Route path="/people/employees" element={<EmployeeDirectoryPage />} />
          <Route path="/people/employees/:id" element={<EmployeeProfilePage />} />
          <Route path="/leave" element={<LeaveHubPage />} />
          <Route path="/leave/apply" element={<ApplyLeaveForm />} />
          <Route path="/leave/calendar" element={<LeaveCalendarPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
