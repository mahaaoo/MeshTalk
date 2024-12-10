export const snapPoint = (
  value: number,
  velocity: number,
  points: readonly number[],
): number => {
  "worklet";
  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter((p) => Math.abs(point - p) === minDelta)[0];
};

export const resopnseWidth = (originWidth: number) => {
  let width = originWidth;
  if (width < 768) {
    width = width;
  } else if (width < 1264) {
    width = width - 72;
  } else {
    width = width - 244;
  }
  return width;
}
 