// Session-local edit history. Snapshots contain plans, never simulation state.
export function createHistory(initial,limit=100){
  let entries=[JSON.stringify(initial)],index=0;
  return {
    record(plan){const value=JSON.stringify(plan);if(value===entries[index])return;entries=entries.slice(0,index+1);entries.push(value);if(entries.length>limit)entries.shift();index=entries.length-1;},
    undo(){if(index===0)return null;return JSON.parse(entries[--index]);},
    redo(){if(index===entries.length-1)return null;return JSON.parse(entries[++index]);},
    get canUndo(){return index>0;},get canRedo(){return index<entries.length-1;}
  };
}
