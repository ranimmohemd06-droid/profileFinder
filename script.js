const form = document.getElementById("search-form");
const input = document.getElementById("username");
const message = document.getElementById("message");
const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const examples = document.querySelectorAll(".example");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = input.value.trim();
  if (name === "") {
    message.textContent = "Please enter a username.";
    return;
  }
  searchUser(name);
});

examples.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    input.value = link.textContent;
    searchUser(link.textContent);
  });
});

async function searchUser(name) {
  message.textContent = "Loading...";
  message.style.color = "#8b949e";
  profileDiv.innerHTML = "";
  reposDiv.innerHTML = "";

  try {
    const userRes = await fetch("https://api.github.com/users/" + name);

    if (!userRes.ok) {
      message.style.color = "#f85149";
      if (userRes.status === 404) {
        message.textContent = "User not found.";
      } else {
        message.textContent = "Something went wrong. Try again later.";
      }
      return;
    }

    const user = await userRes.json();

    const repoRes = await fetch(
      "https://api.github.com/users/" + name + "/repos?sort=updated&per_page=6"
    );
    const repos = await repoRes.json();

    message.textContent = "";
    showProfile(user);
    showRepos(repos);
  } catch (error) {
    message.style.color = "#f85149";
    message.textContent = "Network error. Check your internet.";
  }
}

function showProfile(user) {
  profileDiv.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="${user.login}">
      <div>
        <h3>${user.name || user.login}</h3>
        <p class="login">@${user.login}</p>
        <p>${user.bio || "No bio available."}</p>
        <div class="stats">
          <span>Repos: ${user.public_repos}</span>
          <span>Followers: ${user.followers}</span>
          <span>Following: ${user.following}</span>
        </div>
        <p style="margin-top:10px"><a href="${user.html_url}" target="_blank">View on GitHub</a></p>
      </div>
    </div>
  `;
}

function showRepos(repos) {
  if (repos.length === 0) {
    reposDiv.innerHTML = "<p>No public repositories.</p>";
    return;
  }

  let html = "";
  repos.forEach(function (repo) {
    html += `
      <div class="repo">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description || "No description."}</p>
        <small>${repo.language || "N/A"} &nbsp;|&nbsp; Stars: ${repo.stargazers_count} &nbsp;|&nbsp; Forks: ${repo.forks_count}</small>
      </div>
    `;
  });
  reposDiv.innerHTML = html;
}
