import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { isAuthed } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <h1>SmartBudget</h1>
      {isAuthed ? (
        <p>You are logged in. (Dashboard will go here.)</p>
      ) : (
        <p>Please register or log in to continue.</p>
      )}
    </div>
  );
}
