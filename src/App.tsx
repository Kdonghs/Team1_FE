import { AuthProvider } from "./provider/Auth";
import { OptionProvider } from "./provider/Option";
import { Routes } from "./routes";

function App() {
  return (
    <AuthProvider>
      <OptionProvider>
        <Routes />
      </OptionProvider>
    </AuthProvider>
  );
}

export default App;
