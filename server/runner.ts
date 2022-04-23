
// Params: userId, challId
// Errors: 
//      - invalid userid
//      - invalid challId
//      - already running an instance
//      - too many instances
// returns exposed ports of the instance spun up, separated by new lines
export async function addInstance({
  userId,
  chalId,
}: {
  userId: string;
  chalId: string;
}) {
  let data = { userid: userId, challid: chalId };
  const response = await fetch("/runner/addInstance", {
    method: "GET", //TODO change in runner
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let res = await response.json();
  return res;
}

// Params: userId
// Errors: 
//      - invalid userid
//      - no instance running
//      - instance still starting up
// returns null
export async function removeInstance(userId: string) {
  let data = { userid: userId };
  const response = await fetch("/runner/removeInstance", {
    method: "GET", //TODO change in runner
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let res = await response.json();
  return res;
}

// Params: userId
// Errors: 
//      - invalid userid
//      - no instance running
// returns unix timestamp of when the instance will expire
export async function getTimeLeft(userId: string) {
  let data = { userid: userId };
  const response = await fetch("/runner/getTimeLeft", {
    method: "GET", //TODO change in runner
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let res = await response.json();
  return res;
}

// Params: userId
// Errors: 
//      - invalid userid
//      - already running an instance
//      - too many instances
// returns null
export async function extendTimeLeft(userId: string) {
  let data = { userid: userId };
  const response = await fetch("/runner/extendTimeLeft", {
    method: "GET", //TODO change in runner
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let res = await response.json();
  return res;
}
