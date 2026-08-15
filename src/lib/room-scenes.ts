export const ROOM_SCENES = [
  { id: "sala-01", src: "/rooms/sala-01.jpg", label: "Sala 1" },
  { id: "sala-02", src: "/rooms/sala-02.jpg", label: "Sala 2" },
  { id: "sala-03", src: "/rooms/sala-03.jpg", label: "Sala 3" },
  { id: "sala-04", src: "/rooms/sala-04.jpg", label: "Sala 4" },
] as const;

export type RoomSceneId = (typeof ROOM_SCENES)[number]["id"];

export const DEFAULT_ROOM_SCENE_ID: RoomSceneId = "sala-01";

export function isValidRoomSceneId(value: string): value is RoomSceneId {
  return ROOM_SCENES.some((scene) => scene.id === value);
}

export function getRoomScene(id: string | null | undefined) {
  return (
    ROOM_SCENES.find((scene) => scene.id === id) ??
    ROOM_SCENES.find((scene) => scene.id === DEFAULT_ROOM_SCENE_ID) ??
    ROOM_SCENES[0]
  );
}

/** Stable “random” scene for a room code — same for every guest in that lounge. */
export function sceneIdFromRoomCode(code: string): RoomSceneId {
  const normalized = code.trim().toUpperCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  return ROOM_SCENES[hash % ROOM_SCENES.length]?.id ?? DEFAULT_ROOM_SCENE_ID;
}
