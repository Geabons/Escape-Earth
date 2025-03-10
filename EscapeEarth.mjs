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

    //TASK 1
    //#region
    const sunResponse = await fetch(`${SOLAR_API}bodies/sun`);
    const sunData = await sunResponse.json();
    // console.log("sun data:", sunData);
    //making the above line a comment to reduce clutter in terminal

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
    //#endregion

    //TASK 2
    //#region
    const earthResponse = await fetch(`${SOLAR_API}bodies/earth`);
    const earthData = await earthResponse.json();
    const earthAxialTilt = earthData.axialTilt;
    console.log("Earth's axial tilt:", earthAxialTilt);

    const allBodiesResponse = await fetch(`${SOLAR_API}bodies/`);
    const allBodiesData = await allBodiesResponse.json();

    let closestPlanet = null;
    let smallestDifference = Infinity;

    allBodiesData.bodies.forEach((body) => {
      if (
        body.isPlanet &&
        body.axialTilt !== undefined &&
        body.axialTilt != earthAxialTilt
      ) {
        let difference = Math.abs(body.axialTilt - earthAxialTilt);
        if (difference < smallestDifference) {
          smallestDifference = difference;
          closestPlanet = body;
        }
      }
    });

    console.log("Closest planet:", closestPlanet.englishName);

    const answerResponse2 = await fetch(`${GAME_API}answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer: closestPlanet.englishName,
        player: playerId,
      }),
    });

    const answerData2 = await answerResponse2.json();
    console.log("Answer response:", answerData2);
    //#endregion

    //TASK 3
    //#region
    let shortestDayPlanet = null;
    let shortestDay = Infinity;

    allBodiesData.bodies.forEach((body) => {
      if (body.isPlanet && typeof body.sideralRotation === "number") {
        let shortestPossibleDay = Math.abs(body.sideralRotation);
        if (shortestPossibleDay < shortestDay) {
          shortestDay = shortestPossibleDay;
          shortestDayPlanet = body.englishName;
        }
      }
    });

    console.log("shortest day planet:", shortestDayPlanet);

    const answerResponse3 = await fetch(`${GAME_API}answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: shortestDayPlanet, player: playerId }),
    });

    const answerData3 = await answerResponse3.json();
    console.log("Answer response:", answerData3);
    //#endregion

    //TASK 4
    //#region
    const jupiterResponse = await fetch(`${SOLAR_API}bodies/jupiter`);
    const jupiterData = await jupiterResponse.json();
    const jupiterMoons = jupiterData.moons.length;

    console.log("Jupiter's moons: ", jupiterMoons);

    const answerResponse4 = await fetch(`${GAME_API}answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: jupiterMoons, player: playerId }),
    });
    const answerData4 = await answerResponse4.json();
    console.log("Answer response:", answerData4);
    //#endregion

    //TASK 5
    //#region
    //console.log(jupiterData)
    let largestMoonName = null;
    let largestMoon = 0;

    const jupiterMoonsData = jupiterData.moons;

    for (const moon of jupiterMoonsData) {
      const response = await fetch(moon.rel);
      const data = await response.json();

      if (data.aroundPlanet && typeof data.meanRadius === "number") {
        let largestMoonPossible = Math.abs(data.meanRadius);
        if (largestMoonPossible > largestMoon) {
          largestMoon = largestMoonPossible;
          largestMoonName = data.englishName;
        }
      }
    }
    console.log("largest moon: ", largestMoonName);

    const answerResponse5 = await fetch(`${GAME_API}answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: largestMoonName, player: playerId }),
    });
    const answerData5 = await answerResponse5.json();
    console.log("Answer response:", answerData5);
    //#endregion
  } catch (error) {
    console.error("Error:", error);
  }
})();
