import { MascotDuo } from "@/components/diary/Mascots";

export default function HomeFooter() {
  return (
    <div className="mt-[26px] pb-7">
      <div className="flex justify-center">
        <MascotDuo size={104} style={{ opacity: 0.96 }} />
      </div>
      <div className="mt-0.5 text-center font-hand text-[16px] tracking-[0.3px] text-sub">
        Don&apos;t regret what you do
      </div>
    </div>
  );
}
