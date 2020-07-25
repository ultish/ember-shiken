import Route from "@ember/routing/route";

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    controller.onRouteActivate();
  },

  model() {
    return this.get("store").findRecord("person", "1", {
      include: "pets,pets.shape",
    });
  },
});
