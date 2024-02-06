import RPC from "discord-rpc";
import Enquirer from "enquirer";

const clientId = "1203759686776528977";
const client = new RPC.Client({ transport: "ipc" });

const possibleStates = [
  "Designing",
  "Prototyping",
  "Collaborating",
  "Presenting",
  "Developing"
];

interface IliveSettings {
  details: string
  state: string
  largeImageKey: string
  largeImageText: string
  smallImageKey: string
  smallImageText: string
  label: string
  url: string
}

const goLive = (liveSettings: IliveSettings) => {
  client.on("ready", () => {
    client.setActivity({
      startTimestamp: Date.now(),
      details: liveSettings.details,
      state: liveSettings.state,
      largeImageKey: liveSettings.largeImageKey, 
      largeImageText: liveSettings.largeImageText,
      smallImageKey : liveSettings.smallImageKey,
      smallImageText : liveSettings.smallImageText,
      buttons: [
        { 
          label: liveSettings.label,
          url: liveSettings.url
        },
      ]
    });
  });
  
  client.login({ clientId }).catch(console.error);  
};

console.log("Welcome to Figma Discord RPC !!");

let onBoarding : Partial<IliveSettings> = {};
let isIdle : Partial<{ idle: boolean }> = {};

let hasConnectedOnce = false;
let isAskOpen = false;

const ask = async () => {
  console.log("Asking for status");
  if(isAskOpen) return;
  isAskOpen = true;

  isIdle = await Enquirer.prompt({
    type: "confirm",
    name: "idle",
    message: "Are you Idle?",
  });

  if(hasConnectedOnce) {
    await client.clearActivity();
  }

  if (isIdle.idle) {
    statusRunner({
      details: "Probably taking a break or doing something else.",
      state: "AFK",
      largeImageKey: "figma_main_logo",
      largeImageText: "Zzz....",
      smallImageKey: "figma_frame_sec",
      smallImageText: "Figma RPC by @bravo68web",
      label: "Github Repo",
      url: "https://gtihub.com/thenestdevs/figma-discord-rpc"
    });

    console.log("RPC is now live !!");
  }
  else {
    onBoarding = await Enquirer.prompt([
      {
        type: "input",
        name: "details",
        message: "Enter the details of your activity"
      },
    ]);

    statusRunner({
      details: onBoarding.details!,
      state: isIdle.idle ? "AFK" : possibleStates[Math.floor(Math.random() * possibleStates.length)],
      largeImageKey: "figma_main_logo",
      largeImageText: possibleStates[Math.floor(Math.random() * possibleStates.length)] + " with Figma",
      smallImageKey: "figma_frame_primary",
      smallImageText: "Figma RPC by @bravo68web",
      label: "Github Repo",
      url: "https://gtihub.com/thenestdevs/figma-discord-rpc"
    });

    console.log("RPC is now live !!");
  }

  console.log("Asking for status is now closed");
  hasConnectedOnce = true;
  isAskOpen = false;
};

console.log("Starting Figma Discord RPC !!");

const statusRunner = async (stuff: IliveSettings) => {
  goLive(stuff);
};

setInterval(() => {
  if(!isAskOpen) ask();
}, 2000);