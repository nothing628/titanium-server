import {v4} from 'uuid'

export function generateFilename(extname: string | undefined): string {
  return v4({}) + "." + (extname || "")
}
