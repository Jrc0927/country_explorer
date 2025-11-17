const form = document.getElementById("countryForm");
const input = document.getElementById("countryInput");
const errorMsg = document.getElementById("errorMsg");
const results = document.getElementById("results");

// Event listener
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();

  // Simple validation
  if (query.length < 2) {
    errorMsg.textContent = "Please enter at least 2 characters.";
    results.innerHTML = "";
    return;
  }

  errorMsg.textContent = "";
  results.innerHTML = "<p>Loading country info...</p>";

  try {
    // fetch() call to existing Web API
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // REST Countries returns an array; use the first match
    if (!Array.isArray(data) || data.length === 0) {
      results.innerHTML = "<p>No country found. Try another name.</p>";
      return;
    }

    const country = data[0];

    const name = country.name?.common ?? "Unknown";
    const officialName = country.name?.official ?? "Unknown";
    const capital = country.capital?.[0] ?? "Unknown";
    const region = country.region ?? "Unknown";
    const subregion = country.subregion ?? "Unknown";
    const population = country.population?.toLocaleString() ?? "Unknown";
    const flagUrl = country.flags?.png ?? "";
    const languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "Unknown";
    const currencies = country.currencies
      ? Object.values(country.currencies)
          .map((c) => `${c.name} (${c.symbol ?? ""})`)
          .join(", ")
      : "Unknown";

    // Display data in a user-friendly format
    results.innerHTML = `
      <article class="country-card">
        <div>
          ${
            flagUrl
              ? `<img src="${flagUrl}" alt="Flag of ${name}" class="country-flag" />`
              : ""
          }
        </div>
        <div>
          <h2 class="country-name">${name}</h2>
          <p class="country-meta"><strong>Official name:</strong> ${officialName}</p>
          <p class="country-meta"><strong>Capital:</strong> ${capital}</p>
          <p class="country-meta"><strong>Region:</strong> ${region} (${subregion})</p>
          <p class="country-meta"><strong>Population:</strong> ${population}</p>
          <p class="country-meta"><strong>Languages:</strong> ${languages}</p>
          <p class="country-meta"><strong>Currencies:</strong> ${currencies}</p>
          <p class="country-meta">
            <span class="badge">CCA2: ${country.cca2 ?? "?"}</span>
            <span class="badge">CCA3: ${country.cca3 ?? "?"}</span>
          </p>
        </div>
      </article>
    `;
  } catch (err) {
    console.error(err);
    results.innerHTML =
      "<p>Something went wrong while fetching data. Please try again.</p>";
  }
});
