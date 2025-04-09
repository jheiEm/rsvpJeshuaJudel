import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the title
document.title = "Jeshua & Judel | Wedding RSVP";

createRoot(document.getElementById("root")!).render(<App />);
