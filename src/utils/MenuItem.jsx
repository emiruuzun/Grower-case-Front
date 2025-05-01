import { FaProjectDiagram, FaHome, FaUserCircle } from "react-icons/fa";

export const menuItem = [
  {
    name: "Ana Menü",
    items: [
      {
        name: "Ana Sayfa",
        slug: "dashboard",
        icon: FaHome,
      },
      {
        name: "Projelerim",
        slug: "ProjectSelector",
        icon: FaProjectDiagram,
      },
      {
        name: "Profil",
        slug: "profile",
        icon: FaUserCircle,
      },
    ],
  },
];
