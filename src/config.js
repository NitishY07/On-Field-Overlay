export const matchConfig = {
  // Team A (Left Side)
  teamA: {
    name: "MADRID",
    shortName: "MAD", // Used in the 3D Logo panel
    logo: "/madrid.svg",
    color: "#ffffff", // Real Madrid White
    glowColor: "text-glow-white", // Update this class in index.css if needed, or use inline
  },
  
  // Team B (Right Side)
  teamB: {
    name: "MUNICH",
    shortName: "MUN", // Used in the 3D Logo panel
    logo: "/munich.svg",
    color: "#ff003c", // Bayern Red
    glowColor: "text-glow-red",
  },
  
  // Match Information
  tournament: "CHAMPIONS LEAGUE SEMI-FINAL",
  eventLogo: "/event.svg",
  date: "29 APR 2026",
  location: "SANTIAGO BERNABÉU",

  // Field Branding (Added for the new Overlay)
  centerLogo: "/event.svg",
  brandingLogos: [
    { url: "/scotiabank.svg", name: "Scotiabank" },
    { url: "/allstate.svg", name: "Allstate" },
    { url: "/modelo.svg", name: "Modelo" },
    { url: "/nike.svg", name: "Nike" }
  ],
  brandingText: "Where Champions Are Crowned",
  logoYOffset: -350,
  sponsorYOffset: 300,
  showGrassLogos: true,
  showSponsors: false
}
