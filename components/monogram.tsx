import Image from "next/image";

export function Monogram() {
  return <Image className="monogram" src="/brand/oa-monogram.webp" width={90} height={60} alt="OA" priority unoptimized/>;
}
