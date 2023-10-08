document
  .getElementById("getLocationButton")
  .addEventListener("click", function () {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Display latitude and longitude
        document.getElementById("latitude").textContent = lat;
        document.getElementById("longitude").textContent = lng;

        // Construct the API URL
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=e1dc51e8f91e49dfa5b132223230710&q=${lat},${lng}&aqi=no`;

        // Make the API request
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            // Display temperature, humidity, wind degree, and wind speed
            document.getElementById("temperature").textContent =
              data.current.temp_c;
            document.getElementById("humidity").textContent =
              data.current.humidity;
            document.getElementById("windDegree").textContent =
              data.current.wind_degree;
            document.getElementById("windSpeed").textContent =
              data.current.wind_kph;

            // Show the hidden elements
            document.querySelector(".hidden").style.display = "block";

            // Send input data to the Flask server for forest fire prediction
            const input = {
              temperature: data.current.temp_c,
              humidity: data.current.humidity,
              windSpeed: data.current.wind_kph,
              windDegree: data.current.wind_degree,
            };

            fetch("http://localhost:5000/predict", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(input),
            })
              .then((response) => response.json())
              .then((result) => {
                // Display the forest fire probability
                document.getElementById("forestFireProbability").textContent =
                  result.chance + "%";
              })
              .catch((error) => {
                console.error("Error fetching forest fire prediction:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
          });
      });
    } else {
      // Geolocation not supported or denied by the user
      alert("Geolocation is not available or denied by the user.");
    }
  });