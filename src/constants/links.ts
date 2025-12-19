import { SocialMediaLink } from "@/types/social-media";

export const socialMediaLinks: SocialMediaLink = {
  github: {
    label: "Github",
    link: "https://github.com/aymaneelmaini",
  },
  linkedin: {
    label: "Linkedin",
    link: "https://www.linkedin.com/in/aymane-el-maini/",
  },
  mail: {
    label: "Mail",
    link: "mailto:elmainiaymane03@gmail.com",
  },
  x: {
    label: "X",
    link: "https://x.com/MainiAymane",
  },
};

export const GITHUB_REPOSITORY_URL =
  process.env.GITHUB_REPOSITORY_URL ||
  "https://api.github.com/users/aymaneelmaini/repos?sort=updated&per_page=20";
