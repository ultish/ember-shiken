// import classic from 'ember-classic-decorator';
import Controller from "@ember/controller";
import ChangesetTree from "ember-shiken/framework/changeset-tree";
import { A } from "@ember/array";

export default class ApplicationController extends Controller {
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
    this.updatePetsChangeset(0, 0, petsArray);

    // const cstoPerson = await new ChangesetTreeOctane(person);
    // // cstoPerson.pets = A();
    //
    // this.set("changesetTreeOctane", cstoPerson);
  }

  /**
   * unused, but it should remove the array observer
   */
  deactivate() {
    this.get("model.pets").removeArrayObserver(this, {
      willChange: "syncArrayWillChange",
      didChange: "syncArrayDidChange",
    });
  }

  syncArrayWillChange() {
    // not doing anything
  }

  syncArrayDidChange(syncArray, start, removeCount, addCount) {
    let objectsToAdd = [];
    if (addCount > 0) {
      objectsToAdd = syncArray.slice(start, start + addCount);
    }

    this.updatePetsChangeset(start, removeCount, objectsToAdd);
  }

  updatePetsChangeset(start, removeCount, objectsToAdd) {
    const changesetTree = this.get("changesetTree");

    const newPetChangesetTrees = objectsToAdd.map((pet) =>
      ChangesetTree.create({
        model: pet,
      })
    );

    changesetTree.get("pets").replace(start, removeCount, newPetChangesetTrees);
  }
}
