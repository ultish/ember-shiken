import Controller from "@ember/controller";
import ChangesetTree from "ember-shiken/framework/changeset-tree";
import ChangesetTreeOctane from "ember-shiken/framework/changeset-tree-octane";
import { observer } from "@ember/object";
import { A } from "@ember/array";

export default Controller.extend({
  async onRouteActivate() {
    const person = this.get("model");
    const pets = person.get("pets");

    const changesetTreePerson = ChangesetTree.create({
      model: person,
    });

    changesetTreePerson.set("pets", A());

    this.set("changesetTree", changesetTreePerson);

    const cstoPerson = new ChangesetTreeOctane(person);
    // const petCstos = pets.map((pet) => {
    //   return new ChangesetTreeOctane(pet);
    // });
    // cstoPerson.pets = petCstos;
    cstoPerson.pets = A();

    this.set("changesetTreeOctane", cstoPerson);
  },

  test: observer(
    "model.pets.length",
    "changesetTree",
    "changesetTreeOctane",
    function () {
      const person = this.get("model");
      const changesetTree = this.get("changesetTree");
      const changesetTreeOctane = this.get("changesetTreeOctane");

      if (person && changesetTree) {
        const pets = person.get("pets");
        pets
          .filter((pet) => {
            return !changesetTree.get("pets").findBy("model", pet);
          })
          .forEach((petWithoutChangesetTree) => {
            console.log("pet without CST", petWithoutChangesetTree.get("name"));
            const cst = ChangesetTree.create({
              model: petWithoutChangesetTree,
            });
            changesetTree.get("pets").pushObject(cst);
          });
      }
      if (person && changesetTreeOctane) {
        const pets = person.get("pets");
        pets
          .filter((pet) => {
            return !changesetTreeOctane.pets.findBy("model", pet);
          })
          .forEach((petWithoutChangesetTree) => {
            console.log(
              "pet without CST octane",
              petWithoutChangesetTree.get("name")
            );
            const cst = new ChangesetTreeOctane(petWithoutChangesetTree);
            changesetTreeOctane.pets.pushObject(cst);
          });
      }
    }
  ).on("init"),
});
