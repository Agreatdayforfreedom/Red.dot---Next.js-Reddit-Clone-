import type { MissingKeys, NestedThread, RawThread, Thread } from "../types";
import { rawUserPrefix } from "./prefix";

export function formatRaw(
  raw: RawThread[],
  parent_id: string | null = null
): NestedThread[] {
  let withUser = raw.map((obj: RawThread) => {
    return _formatRaw(obj);
  });
  return pushAsChild(withUser, [], parent_id);
}

function _formatRaw(obj: RawThread) {
  let formatted: Thread & MissingKeys = Object.assign({
    user: Object.assign({}),
  });
  for (const key in obj) {
    let row = obj[key as keyof RawThread];
    let k = key as keyof RawThread;
    if (key.startsWith(rawUserPrefix)) {
      let keyWithoutPrefix = key.split("_")[1];
      Object.assign(formatted.user, { [keyWithoutPrefix]: row });
    } else {
      Object.assign(formatted, { [k]: row });
    }
  }
  return formatted;
}

export function $assingRawUser(obj: RawThread) {
  return _formatRaw(obj);
}

function pushAsChild(
  arr: (Thread & MissingKeys)[],
  end: NestedThread[],
  parent_id: string | null
) {
  for (const t of arr) {
    let obj = {
      ...t,
      children: [],
    };
    if (t.parent_id === parent_id) {
      end.push(obj);
      pushAsChild(arr, obj.children, t.id);
    }
  }
  return end;
}
