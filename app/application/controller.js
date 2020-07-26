import Controller from "@ember/controller";
import ChangesetTree from "ember-shiken/framework/changeset-tree";

export default Controller.extend({
  async onRouteActivate() {
    const person = this.get("model");
    const pets = person.get("pets");

    const changesetTreePerson = ChangesetTree.create({
      model: person,
    });

    const petChangesetTrees = pets.map((pet) => {
      return ChangesetTree.create({
        model: pet,
      });
    });

    changesetTreePerson.set("pets", petChangesetTrees);

    this.set("changesetTree", changesetTreePerson);
  },
});
