import Link from "next/link";
import { Button } from "../ui/button";

export function NavBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-black border">
      <p className="font-bold">Delivery App</p>
      <div className="flex items-center justify-between space-x-2">
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
        <Link href={"/partners"}>
          <Button>Partners</Button>
        </Link>
        <Link href={"/orders"}>
          <Button>Orders</Button>
        </Link>
      </div>
    </div>
  );
}
