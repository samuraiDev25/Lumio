export function fileKey(file: File) {
  return `${file.name}_${file.size}_${file.lastModified}`;
}
