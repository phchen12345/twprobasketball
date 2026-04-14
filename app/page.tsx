import HomePageExperience from "@/components/experience/HomePageExperience";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "台灣籃球職業聯賽賽程",
    alternateName: "台灣職籃賽程",
    url: "https://taiwanprobasketball.vercel.app",
    description:
      "提供台灣籃球職業聯賽賽程整理，包含 TPBL、PLG 與 BCL Asia-East 賽程、比賽時間、場館與直播資訊。",
    inLanguage: "zh-TW",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageExperience />
    </>
  );
}
