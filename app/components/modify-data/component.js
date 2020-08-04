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

    const people = await store.findAll("person");
    this.set("people", people);

    const shapes = await this.store.findAll("bodyshape");
    this.set("shapes", shapes);
  },

  actions: {
    selection: function (pet, selected) {
      pet.set("shape", selected);
      pet.save();
    },

    addPet: function () {
      const person = this.people.toArray()[0];

      const index = Math.floor(Math.random() * this.shapes.length);
      const shape = this.shapes.toArray()[index];
      this.store.createRecord("pet", {
        name: `pet ${Math.random() * 100}`,
        age: Math.random() * 100,
        shape: shape,
        owner: person,
      });
    },
  },
});
