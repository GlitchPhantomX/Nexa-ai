import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-500">
        Hello World - If you see this, it works!
      </h1>
      <Button variant="custom">
        Click Me
      </Button>
    </div>
  );
}

