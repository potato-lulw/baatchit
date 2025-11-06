import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/ModeToggle";

function App() {
  return (
    <>
      <div className="text-2xl font-bold overflow-hidden h-screen">
        <Button>Hello</Button>
        <ModeToggle />
      </div>
    </>
  );
}

export default App;
