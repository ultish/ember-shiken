import EmberObject from "@ember/object";
import Changeset from "ember-changeset";

export default EmberObject.extend({
  init() {
    this._super(...arguments);
    const model = this.get("model");
    if (model) {
      this.set("changeset", new Changeset(model));
      this.set("model", model);
    }
  },
});
