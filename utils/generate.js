const generate = async () => {
  const csv = require("csvtojson");
  const fs = require("fs");
  let trips = await csv().fromFile("./data/trips.txt");
  let stops = await csv().fromFile("./data/stops.txt");
  let routes = await csv().fromFile("./data/routes.txt");
  let stopTimes = await csv().fromFile("./data/stop_times.txt");
  let fsFilePairs = [];
  // create something similar to {trip, route}
  let tripsJson = [];
  if (trips != []) {
    trips.forEach((t) => {
      tripsJson.push({
        trip: t.trip_id,
        route: t.route_id,
        direction: t.direction_id,
      });
    });

    fsFilePairs.push({
      file: "../src/internalData/trips.json",
      content: JSON.stringify(tripsJson),
    });
  }

  // create file with route names
  let routesJson = [];
  if (routes != []) {
    routes.forEach((r) => {
      routesJson.push({ id: r.route_id, name: r.route_long_name });
    });
    fsFilePairs.push({
      file: "../src/internalData/routes.json",
      content: JSON.stringify(routesJson),
    });
  }

  // generate station files
  let stationJson = [];

  if (stopTimes.length > 0 && stops.length > 0 && tripsJson.length > 0) {
    tripsJson.forEach((tr) => {
      const thisStationId = `${tr.route}_${tr.direction}`;

      stopTimes.forEach((st) => {
        if (st.trip_id == tr.trip) {
          const filteredStation = stops.filter((s) => s.stop_id == st.stop_id);
          if (filteredStation.length > 0) {
            stationJson.push({
              name: filteredStation[0]["stop_name"],
              lat: filteredStation[0]["stop_lat"],
              lon: filteredStation[0]["stop_lon"],
            });
          }
        }
      });

      fsFilePairs.push({
        file: `../public/stations/${thisStationId}.json`,
        content: JSON.stringify(stationJson, null, 2),
      });

      stationJson = [];
    });
  }

  for (const f of fsFilePairs) {
    try {
      await fs.promises.writeFile(f.file, f.content);
      console.log(`File ${f.file} has been created`);
    } catch (err) {
      console.error(`Error writing ${f.file}:`, err);
    }
  }
};

generate();
