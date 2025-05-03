// pages/Home.tsx
import SideBar from "../components/SideBar";
import { AppBar } from "../components/Appbar";
import { useUser } from "../atoms/usecontext";
import FinanceTip from "../components/Financetip";

export default function Home() {
  const { user } = useUser();
  const name = user?.name ?? "User";

  return (
    <div>
      {/* Row 1: Appbar */}
      <AppBar name={name} />

      {/* Row 2: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar (fixed width) */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Welcome back, {name}! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
            Here’s a finance tip to help you make smarter money moves today.
          </p>
          <FinanceTip />
        </main>
      </div>
    </div>
  );
}
