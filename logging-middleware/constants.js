// logging-middleware/constants.js

module.exports = {
  stacks: ["backend", "frontend"],
  levels: ["debug", "info", "warn", "error", "fatal"],
  packages: {
    backend: [
      "cache", "controller", "cron_job", "db",
      "domain", "handler", "repository", "route", "service"
    ],
    frontend: [
      "api", "component", "hook", "page", "state", "style"
    ],
    shared: ["auth", "config", "middleware", "utils"]
  }
};
