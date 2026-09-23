import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-cleans when Vitest globals are on; they are not, so
// without this every render stacks up in the same document.
afterEach(cleanup);
