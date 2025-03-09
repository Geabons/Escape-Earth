import fetch from "node-fetch";

const SOLAR_API = "https://api.le-systeme-solaire.net/rest/";
const playerId = "Martinlen@uia.no";
const GAME_API = "https://spacescavanger.onrender.com/";

(async function () {
  try {
    const startUrl = `${GAME_API}start?player=${encodeURIComponent(playerId)}`;
    const startResponse = await fetch(startUrl);
    const startData = await startResponse.json();
    console.log("Challenge started:", startData);

    const sunResponse = await fetch(`${SOLAR_API}bodies/sun`);
    const sunData = await sunResponse.json();
    //console.log("sun data:", sunData);

    const sunEquaRadius = sunData.equaRadius;
    const sunMeanRadius = sunData.meanRadius;
    const accessPin = sunEquaRadius - sunMeanRadius;
    
    const answerResponse1 = await fetch(`${GAME_API}answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: accessPin, player: playerId }),
    });
    const answerData1 = await answerResponse1.json();
    console.log("Answer response:", answerData1);

  } catch (error) {
    console.error("Error:", error);
  }
})();
