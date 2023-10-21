import Image from "next/image";
import LemonSvg from "~/components/Lemon.svg";

export const BrandHead = () => (
  <div className="flex items-center">
    <Image
      priority
      // className="animate-spin"
      src={LemonSvg as string}
      alt="LemmeGetta Logo"
      width={40}
      height={40}
    />
    <div className="center pl-2 font-brand2 text-2xl text-yellow-400">
      LemmeGetta
    </div>
  </div>
);
