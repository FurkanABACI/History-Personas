const urlPageTitle = "HISTORY PERSONAS";

document.addEventListener("click", (e) => {
  const { target } = e;
  if (!target.matches("nav a")) {
    return;
  }
  e.preventDefault();
  urlRoute();
})

const urlRoutes = {
  404: {
    template: "/404Folder/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found"
  },
  "/": {
    template: "/homeFolder/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the Home page"
  },
  "/conversations": {
    template: "/conversationsFolder/conversations.html",
    title: "Conversations | " + urlPageTitle,
    description: "This is the Conversations Page"
  },
  "/settings": {
    template: "/settingsFolder/settings.html",
    title: "Settings | " + urlPageTitle,
    description: "This is the Settings Page"
  },
  "/login": {
    template: "/loginFolder/login.html",
    title: "Login | " + urlPageTitle,
    description: "This is the Login Page"
  },
}

const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  urlLocationHandler();
}

const urlLocationHandler = async () => {
  let location = window.location.pathname;
  if (location.length == 0) {
    location = "/";
  }
  const route = urlRoutes[location] || urlRoutes[404];
  const html = await fetch(route.template).then((Response) =>
    Response.text());
  document.getElementById("content").innerHTML = html;
  document.title = route.title
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", route.description);
}
window.onpopstate = urlLocationHandler;
window.urlRoute = urlRoute;
urlLocationHandler();