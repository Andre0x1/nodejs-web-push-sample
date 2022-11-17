const publicVapidKey =
  "BKbvAgTVIKSN_NoSGAGls8COda1sXr-zYzUHFFENDTcQLHsH-pWA-U6AS8khh7jjGQs5rkmt-dQrgroU487eXO0";

var user = 2;

navigator.serviceWorker.register("./worker.js", { scope: "/" }).then(
  async function (reg) {
    var subs;
    var serviceWorker;
    if (reg.installing) {
      serviceWorker = reg.installing;
      // console.log('Service worker installing');
    } else if (reg.waiting) {
      serviceWorker = reg.waiting;
      // console.log('Service worker installed & waiting');
    } else if (reg.active) {
      serviceWorker = reg.active;
      subs = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });
    }

    if (serviceWorker) {
      console.log("sw current state", serviceWorker.state);
      if (serviceWorker.state == "activated") {
        console.log("sw already activated - Do watever needed here");

        subs = await reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicVapidKey,
          })
          .then(async function (resp) {
            await fetch("/subscribe/" + user, {
              method: "POST",
              body: JSON.stringify(resp),
              headers: {
                "Content-Type": "application/json",
              },
            });
          });
      }
      serviceWorker.addEventListener("statechange", async function (e) {
        console.log("sw statechange : ", e.target.state);
        if (e.target.state == "activated") {
          // use pushManger for subscribing here.
          console.log(
            "Just now activated. now we can subscribe for push notification"
          );
          if (subs) {
            await fetch("/subscribe/" + user, {
              method: "POST",
              body: JSON.stringify(subs),
              headers: {
                "Content-Type": "application/json",
              },
            });
          } else {
            subs = await reg.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey,
              })
              .then(async function (resp) {
                await fetch("/subscribe/" + user, {
                  method: "POST",
                  body: JSON.stringify(resp),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              });
          }
        }
      });
    }
  },
  function (err) {
    console.error("unsuccessful registration with ", workerFileName, err);
  }
);
