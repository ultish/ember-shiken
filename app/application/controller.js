import Controller from "@ember/controller";
import ChangesetTree from "ember-shiken/framework/changeset-tree";
import ChangesetTreeOctane from "ember-shiken/framework/changeset-tree-octane";
import { A } from "@ember/array";

export default Controller.extend({
  async onRouteActivate() {
    const person = this.get("model");

    const changesetTreePerson = ChangesetTree.create({
      model: person,
    });

    const petsArray = person.get("pets");

    // add an observer to the array of pets
    petsArray.addArrayObserver(this, {
      willChange: "syncArrayWillChange",
      didChange: "syncArrayDidChange",
    });

    changesetTreePerson.set("pets", A());

    this.set("changesetTree", changesetTreePerson);

    const cstoPerson = new ChangesetTreeOctane(person);
    cstoPerson.pets = A();

    this.set("changesetTreeOctane", cstoPerson);

    this.updatePetsChangeset(0, 0, petsArray);
  },

  /**
   * unused, but it should remove the array observer
   */
  deactivate() {
    this.get("model.pets").removeArrayObserver(this, {
      willChange: "syncArrayWillChange",
      didChange: "syncArrayDidChange",
    });
  },

  syncArrayWillChange() {
    // not doing anything
  },
  syncArrayDidChange(syncArray, start, removeCount, addCount) {
    let objectsToAdd = [];
    if (addCount > 0) {
      objectsToAdd = syncArray.slice(start, start + addCount);
    }

    this.updatePetsChangeset(start, removeCount, objectsToAdd);
  },

  updatePetsChangeset(start, removeCount, objectsToAdd) {
    const changesetTree = this.get("changesetTree");
    const changesetTreeOctane = this.get("changesetTreeOctane");

    const newPetChangesetTrees = objectsToAdd.map((pet) =>
      ChangesetTree.create({
        model: pet,
      })
    );

    const newPetChangesetTreeOctanes = objectsToAdd.map(
      (pet) => new ChangesetTreeOctane(pet)
    );

    changesetTree.get("pets").replace(start, removeCount, newPetChangesetTrees);
    changesetTreeOctane.pets.replace(
      start,
      removeCount,
      newPetChangesetTreeOctanes
    );
  },
});
