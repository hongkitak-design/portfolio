// 설정 안에서 이미지 주소가 쓰인 곳을 세고, 한 번에 바꿉니다 (로고·원형 메뉴·블록 이미지 모두 포함)

export function countImageRefs(value: unknown, counts = new Map<string, number>()) {
  if (typeof value === "string") counts.set(value, (counts.get(value) ?? 0) + 1);
  else if (Array.isArray(value)) value.forEach((v) => countImageRefs(v, counts));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => countImageRefs(v, counts));
  return counts;
}

export function replaceImageRefs<T>(value: T, from: string, to: string): T {
  if (value === from) return to as T;
  if (Array.isArray(value)) return value.map((v) => replaceImageRefs(v, from, to)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceImageRefs(v, from, to)])) as T;
  }
  return value;
}
