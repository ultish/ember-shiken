import Component from "@ember/component";
import { inject as service } from "@ember/service";

export default Component.extend({
  store: service(),

  didInsertElement() {
    this.loadData();
  },

  async loadData() {
    const store = this.get("store");
    const bodyShapes = await store.findAll("bodyshape");
    const pets = await store.findAll("pet");

    this.set("bodyShapes", bodyShapes);
    this.set("pets", pets);
  },

  actions: {
    selection: function (pet, selected) {
      pet.set("shape", selected);
      pet.save();
    },
  },
});
