import Changeset from "ember-changeset";
import { tracked } from "@glimmer/tracking";
import { set, defineProperty, get, computed } from "@ember/object";
import { all } from "rsvp";
import { A } from "@ember/array";

// Note: we can still add computed and observers to native classes
// computed can be done via annotations, observers via these functions
// import { addObserver, removeObserver } from "@ember/object/observers";

export default class ChangesetTreeOctane {
  @tracked
  changeset;

  @tracked
  model;

  @tracked
  childChangesetTrees = A();

  @tracked
  relationshipObservers = A();

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
    return this.initialise();
  }

  // Note: when this is computed, it won't work...
  // @computed("changeset.changes.[]")
  get testPristine() {
    return this.changeset.changes.length === 0;
  }

  get testPristine2() {
    if (!this.changeset.isPristine) {
      return false;
    } else {
      let result = true;
      // check child changesets
      for (let childKey of this.relationshipObservers) {
        const childCSTs = get(this, childKey);

        let childResult = true;
        for (let childCST of childCSTs) {
          const childCSTPristine = childCST.testPristine2;
          if (!childCSTPristine) {
            childResult = false;
            break;
          }
        }
        if (!childResult) {
          result = false;
          break;
        }
      }
      console.log("result", result, this);
      return result;
    }
  }
  /*
  // This does not work, the only diff to testPristine2 seems to be the reduce functions?
  get testPristine3() {
    if (!this.changeset.isPristine) {
      return false;
    } else {
      // check the children
      const result =
        this.relationshipObservers.reduce((result, childKey) => {
          if (result) {
            //this[childKey]
            result = get(this, childKey).reduce((childResult, childCST) => {
              if (childResult) {
                // check child CST
                childResult = childCST.testPristine3;
              }
              return childResult;
            }, true);
          } else {
            return result;
          }
        }, true) || true;

      return result;
    }
  }
  */

  async initialise() {
    await this.buildRelationshipChangesetTrees(this.model);

    // watch for relationship changes for those that require changesets
    // Note this may change when changesets track child models automatically...
    // this is still old way of doing it
    this.model.eachRelationship((key, meta) => {
      // console.log(key, meta);
      if (meta.options.changesetRequired) {
        this.relationshipObservers.push(key);
        this.model[key].addArrayObserver(this, {
          willChange: "syncArrayWillChange",
          didChange: "syncArrayDidChange",
        });
      }
    });

    return this;
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

    for (let key of keys) {
      const childChangesetTrees = [];
      const relationshipModels = model[key].toArray();
      for (let child of relationshipModels) {
        const childChangsetTreeOctane = await new ChangesetTreeOctane(child);
        childChangesetTrees.push(childChangsetTreeOctane);
      }
      this[key] = childChangesetTrees;
      this.childChangesetTrees.pushObjects(childChangesetTrees);
    }

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

    // TODO does this work? specifically for removes?
    this.childChangesetTrees.replace(
      start,
      removeCount,
      newPetChangesetTreeOctanes
    );

    set(this, key, changesetsForRel);
  }
}
