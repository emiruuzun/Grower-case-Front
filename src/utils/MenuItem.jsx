import {
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaTags,
  FaBolt,
  FaUserCircle,
} from "react-icons/fa";

export const menuItem = [
  {
    name: "Profil",
    items: [
      {
        name: "Profil Bilgilerim",
        slug: "profile",
        icon: FaUserCircle,
      },
    ],
  },
  {
    name: "SEO Paneli",
    items: [
      {
        name: "Genel Trafik",
        slug: "traffic",
        icon: FaChartBar,
      },
      {
        name: "Rakip Trafiği",
        slug: "competitor-traffic",
        icon: FaTags,
      },
      {
        name: "Zaman Bazlı Trafik",
        slug: "comparative-traffic",
        icon: FaBolt,
      },
      {
        name: "Anahtar Kelime Hacmi",
        slug: "keyword-volume",
        icon: FaChartBar,
      },
      {
        name: "Takip Edilen Kelimeler",
        slug: "tracked-keywords",
        icon: FaTags,
      },
      {
        name: "Yükselen Kelimeler",
        slug: "rising-keywords",
        icon: FaArrowUp,
      },
      {
        name: "Düşen Kelimeler",
        slug: "falling-keywords",
        icon: FaArrowDown,
      },
    ],
  },
];
