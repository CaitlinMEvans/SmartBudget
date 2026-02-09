import { useAuth } from "../auth/AuthContext";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { isAuthed } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <h1>SmartBudget</h1>
      {isAuthed ? (
        <>
          <Dashboard></Dashboard>
        </>
      ) : (
        <p>Please register or log in to continue.</p>
      )}
    </div>
  );
}
