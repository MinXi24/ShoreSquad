document.addEventListener("DOMContentLoaded", () => {
  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "<p>Loading forecast...</p>";

  fetch("https://api.data.gov.sg/v1/environment/24-hour-weather-forecast")
    .then(response => response.json())
    .then(data => {
      const forecast = data.items[0].general.forecast;
      const low = data.items[0].general.temperature.low;
      const high = data.items[0].general.temperature.high;

      weatherDiv.innerHTML = `
        <h2>Singapore Weather Forecast</h2>
        <p>${forecast}</p>
        <p>Temperature: ${low}°C – ${high}°C</p>
      `;
    })
    .catch(error => {
      weatherDiv.innerHTML = "<p>Error loading weather 😢</p>";
      console.error(error);
    });
});
