export default function generateId(index: number = 0) {
  if (index > 3) index = 3;
  if (index < 0) index = 0;
  return crypto.randomUUID().split("-")[index];
}
