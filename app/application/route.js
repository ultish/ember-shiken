import classic from "ember-classic-decorator";
import Route from "@ember/routing/route";

@classic
export default class ApplicationRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.onRouteActivate();
  }

  model() {
    return this.get("store").findRecord("person", "1", {
      include: "pets,pets.shape,pets.toys",
    });
  }
}
