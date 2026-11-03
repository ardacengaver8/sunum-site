// The demo film's room: its average and the spread of everyone's scores, as a
// smooth hill (two bumps, like a real film's spread). The rating demo and the
// opened poster both draw it.
export const ROOM_AVG = 7.4

export const roomCurve = (s) => Math.exp(-((s - 7.6) ** 2) / 1.1) + 0.35 * Math.exp(-((s - 5.2) ** 2) / 0.8)
