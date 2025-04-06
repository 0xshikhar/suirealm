// import { createReactClient } from "@livepeer/react";
// import { studioProvider } from "@livepeer/react/providers/studio";

// const LivepeerClient = createReactClient({
//     provider: studioProvider({ apiKey: "YOUR_API_KEY" }),
// });

// export default LivepeerClient;

import { Livepeer } from "livepeer";
import { streamKey } from "./contracts";

const livepeer = new Livepeer({
    apiKey: streamKey,
});

const main = async () => {
    const { stream } = await livepeer.stream.create({
        name: "Hello from JS SDK!",
    });
    console.log(stream);
};

main();