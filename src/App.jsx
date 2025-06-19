import { useEffect, useState } from "react";
import { processGtfs } from "./utils/processGtfs";
import { getRouteName } from "./utils/getRouteName";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function get() {
      const data = await processGtfs();
      setData(data);
    }
    get();
  }, []);
  return (
    <div className="px-16 py-8">
      <h1 className="">Trains</h1>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {data.map((d) => {
          console.log(d);
          return (
            <div class="max-w-[100%] mx-2 rounded overflow-hidden shadow-lg bg-white text-black my-2">
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">
                  {getRouteName(d.tripId)}
                </div>
                <p class="text-gray-700 text-base">Description</p>
              </div>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
}

export default App;
