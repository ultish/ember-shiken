import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { action } from "@ember/object";

export default class ModifyData extends Component {
  @service
  store;

  didInsertElement() {
    this.loadData();
  }

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
  }

  @action
  selection(pet, selected) {
    pet.set("shape", selected);
    pet.save();
  }

  @action
  addPet() {
    const person = this.people.toArray()[0];

    const index = Math.floor(Math.random() * this.shapes.length);
    const shape = this.shapes.toArray()[index];
    this.store.createRecord("pet", {
      name: `pet ${Math.random() * 100}`,
      age: Math.random() * 100,
      shape: shape,
      owner: person,
    });
  }

  @action
  removePet(pet) {
    pet.destroyRecord();
  }
}
