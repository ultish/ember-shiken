import classic from "ember-classic-decorator";
import Route from "@ember/routing/route";
import ChangesetTreeOctane from "ember-shiken/framework/changeset-tree-octane";

@classic
export default class ApplicationRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.onRouteActivate();
    controller.changesetTreeOctane = this.changesetTreeOctane;
  }

  async afterModel(model) {
    const cstOctane = await this.buildChangesetTreeOctane(model);
    this.set("changesetTreeOctane", cstOctane);
    debugger;
  }

  async buildChangesetTreeOctane(model) {
    const person = model;
    const cstoPerson = await new ChangesetTreeOctane(person);
    return cstoPerson;
  }

  model() {
    return this.get("store").findRecord("person", "1", {
      include: "pets,pets.shape,pets.toys",
    });
  }
}
