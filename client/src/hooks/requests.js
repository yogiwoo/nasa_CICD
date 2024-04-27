// In your JavaScript file (e.g., script.mjs)
const APIurl = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  const response = await fetch(`${APIurl}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  const response = await fetch(`${APIurl}/launches`);
  const fetchLaunches = await response.json();
  return fetchLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${APIurl}/launches`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(launch)
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${APIurl}/launches/${id}`, {
      method: 'delete'
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
