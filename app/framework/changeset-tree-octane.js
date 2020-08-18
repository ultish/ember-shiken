import Changeset from "ember-changeset";
import { tracked } from "@glimmer/tracking";
import { set } from "@ember/object";
import { all } from "rsvp";
// Note: we can still add computed and observers to native classes
// computed can be done via annotations, observers via these functions
// import { addObserver, removeObserver } from "@ember/object/observers";

export default class ChangesetTreeOctane {
  @tracked
  changeset;

  @tracked
  model;

  /**
   * If we add this tracked property here,
   * dependencies of this won't need to use
   * computed.
   *
   * TODO: Can we dynamically add properties for tracking?
   */
  // @tracked
  // pets;

  constructor(model) {
    this.model = model;
    this.changeset = new Changeset(this.model);

    this.buildRelationshipChangesetTrees(this.model);

    this.relationshipObservers = [];

    // watch for relationship changes for those that require changesets
    // Note this may change when changesets track child models automatically...
    // this is still old way of doing it
    this.model.eachRelationship((key, meta) => {
      console.log(key, meta);
      if (meta.options.changesetRequired) {
        this.relationshipObservers.push(key);
        this.model[key].addArrayObserver(this, {
          willChange: "syncArrayWillChange",
          didChange: "syncArrayDidChange",
        });
      }
    });
  }

  async buildRelationshipChangesetTrees(model) {
    const keys = [],
      promises = [];
    model?.eachRelationship((key, meta) => {
      if (meta?.options?.changesetRequired) {
        keys.push(key);
        promises.push(model[key]);
      }
    });

    await all(promises);

    keys.forEach((key) => {
      const childChangesetTrees = [];
      const relationshipModels = model[key];
      relationshipModels.forEach((child) => {
        const childChangsetTreeOctane = new ChangesetTreeOctane(child);
        childChangesetTrees.push(childChangsetTreeOctane);
      });
      this[key] = childChangesetTrees;
    });

    console.log("cst", this);
  }

  // Note: This function must be manually called, otherwise we'll have a memleak
  cleanup() {
    for (let key of this.relationshipObservers) {
      this.model[key].removeArrayObserver(this, {
        willChange: "syncArrayWillChange",
        didChange: "syncArrayDidChange",
      });
    }
  }

  syncArrayWillChange() {
    // not doing anything
  }

  syncArrayDidChange(syncArray, start, removeCount, addCount) {
    let objectsToAdd = [];
    if (addCount > 0) {
      objectsToAdd = syncArray.slice(start, start + addCount);
    }

    const relKey = syncArray.content.key;

    this.updateChangeset(relKey, start, removeCount, objectsToAdd);
  }

  updateChangeset(key, start, removeCount, objectsToAdd) {
    const changesetsForRel = this[key] || [];
    // build new changesetTrees
    const newPetChangesetTreeOctanes = objectsToAdd.map(
      (pet) => new ChangesetTreeOctane(pet)
    );
    changesetsForRel.replace(start, removeCount, newPetChangesetTreeOctanes);
    set(this, key, changesetsForRel);
  }
}
